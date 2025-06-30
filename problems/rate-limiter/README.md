# 🚫 Rate Limiter System Design

> **Design a rate limiting system that can handle millions of requests per second and provide flexible rate limiting policies.**

## 📋 **Problem Statement**

Design a rate limiting system that can:
- Limit requests per user/IP/API key
- Support different rate limiting algorithms
- Handle high traffic and scale efficiently
- Provide real-time rate limiting decisions
- Support distributed deployment

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Rate Limiting**: Limit requests based on various criteria (IP, user, API key)
- **Multiple Algorithms**: Support token bucket, sliding window, fixed window
- **Flexible Policies**: Different limits for different endpoints/users
- **Real-time Decisions**: Fast rate limiting decisions (< 10ms)
- **Distributed Support**: Work across multiple servers
- **Monitoring**: Track rate limiting events and violations

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 1M+ requests per second
- **Performance**: < 10ms response time for rate limiting decisions
- **Availability**: 99.9% uptime
- **Accuracy**: Precise rate limiting with minimal false positives/negatives
- **Memory Efficient**: Minimal memory footprint for rate limiting data

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Total Requests per Second: 1M RPS
Rate Limiting Decisions per Second: 1M decisions/sec
Unique Users/IPs: 10M active users
Rate Limiting Rules: 1000+ different policies
Storage per Rate Limit Entry: ~100 bytes
Memory Requirements: 10M * 100 bytes = 1GB for active entries
```

### 💾 **Storage Requirements**
```
Rate Limit Entry:
- Key (IP/User ID): 32 bytes
- Current count: 8 bytes
- Window start time: 8 bytes
- Last reset time: 8 bytes
- Policy ID: 4 bytes
- Total per entry: ~60 bytes

Policy Configuration:
- Policy ID: 4 bytes
- Rate limit: 4 bytes
- Window size: 4 bytes
- Algorithm type: 1 byte
- Total per policy: ~13 bytes
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │   Load Balancer │    │   Application   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Rate Limiter         │
                    │      Service              │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Cache Layer          │
                    │      (Redis)              │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Policy Store         │
                    │   (PostgreSQL/Redis)      │
                    └───────────────────────────┘
```

### 🔄 **Data Flow**
```
1. Request Arrives:
   Client → API Gateway → Rate Limiter → Cache → Decision

2. Policy Lookup:
   Rate Limiter → Policy Store → Policy Configuration

3. Rate Limit Check:
   Rate Limiter → Cache → Algorithm → Decision

4. Response:
   Rate Limiter → API Gateway → Client
```

## 🗄️ **Database Design**

### 📊 **Rate Limit Policies Table (PostgreSQL)**
```sql
CREATE TABLE rate_limit_policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    algorithm_type VARCHAR(20) NOT NULL, -- 'token_bucket', 'sliding_window', 'fixed_window'
    rate_limit INTEGER NOT NULL, -- requests per window
    window_size INTEGER NOT NULL, -- window size in seconds
    burst_limit INTEGER, -- for token bucket
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rate_limit_assignments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES rate_limit_policies(id),
    resource_type VARCHAR(20) NOT NULL, -- 'ip', 'user', 'api_key', 'endpoint'
    resource_pattern VARCHAR(200) NOT NULL, -- pattern to match
    priority INTEGER DEFAULT 0, -- higher priority wins
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📈 **Rate Limit State (Redis)**
```redis
# Token Bucket State
rate_limit:token_bucket:{key}:{policy_id} = {
    "tokens": 10,
    "last_refill": 1640995200,
    "capacity": 10,
    "refill_rate": 1
}

# Sliding Window State
rate_limit:sliding_window:{key}:{policy_id} = [
    {"timestamp": 1640995200, "count": 5},
    {"timestamp": 1640995201, "count": 3}
]

# Fixed Window State
rate_limit:fixed_window:{key}:{policy_id} = {
    "window_start": 1640995200,
    "count": 8
}
```

## 🔧 **Detailed Component Design**

### 🚫 **Rate Limiter Service**
```python
class RateLimiterService:
    def __init__(self, redis_client, policy_store):
        self.redis = redis_client
        self.policy_store = policy_store
        self.algorithms = {
            'token_bucket': TokenBucketAlgorithm(),
            'sliding_window': SlidingWindowAlgorithm(),
            'fixed_window': FixedWindowAlgorithm()
        }
    
    def check_rate_limit(self, key, resource_type, endpoint):
        # Get applicable policy
        policy = self.policy_store.get_policy(resource_type, key, endpoint)
        if not policy:
            return RateLimitResult(allowed=True, remaining=0, reset_time=None)
        
        # Get algorithm
        algorithm = self.algorithms[policy.algorithm_type]
        
        # Check rate limit
        result = algorithm.check_limit(key, policy)
        
        # Log rate limit event
        self.log_rate_limit_event(key, policy, result)
        
        return result
    
    def log_rate_limit_event(self, key, policy, result):
        event = {
            "key": key,
            "policy_id": policy.id,
            "allowed": result.allowed,
            "timestamp": datetime.now(),
            "remaining": result.remaining
        }
        # Send to message queue for async processing
        message_queue.publish("rate_limit_events", event)
```

### 🔄 **Rate Limiting Algorithms**

#### 1. **Token Bucket Algorithm**
```python
class TokenBucketAlgorithm:
    def check_limit(self, key, policy):
        bucket_key = f"rate_limit:token_bucket:{key}:{policy.id}"
        
        # Get current bucket state
        bucket_data = self.redis.hgetall(bucket_key)
        if not bucket_data:
            # Initialize bucket
            bucket_data = {
                "tokens": str(policy.burst_limit),
                "last_refill": str(int(time.time())),
                "capacity": str(policy.burst_limit),
                "refill_rate": str(policy.rate_limit / policy.window_size)
            }
            self.redis.hmset(bucket_key, bucket_data)
            self.redis.expire(bucket_key, policy.window_size * 2)
        
        # Refill tokens
        current_time = time.time()
        last_refill = float(bucket_data["last_refill"])
        refill_rate = float(bucket_data["refill_rate"])
        capacity = float(bucket_data["capacity"])
        
        time_passed = current_time - last_refill
        tokens_to_add = time_passed * refill_rate
        current_tokens = min(capacity, float(bucket_data["tokens"]) + tokens_to_add)
        
        # Check if request is allowed
        if current_tokens >= 1:
            # Consume token
            new_tokens = current_tokens - 1
            self.redis.hmset(bucket_key, {
                "tokens": str(new_tokens),
                "last_refill": str(current_time)
            })
            
            return RateLimitResult(
                allowed=True,
                remaining=int(new_tokens),
                reset_time=int(current_time + (capacity - new_tokens) / refill_rate)
            )
        else:
            return RateLimitResult(
                allowed=False,
                remaining=0,
                reset_time=int(current_time + (1 - current_tokens) / refill_rate)
            )
```

#### 2. **Sliding Window Algorithm**
```python
class SlidingWindowAlgorithm:
    def check_limit(self, key, policy):
        window_key = f"rate_limit:sliding_window:{key}:{policy.id}"
        current_time = int(time.time())
        window_start = current_time - policy.window_size
        
        # Remove old entries
        self.redis.zremrangebyscore(window_key, 0, window_start)
        
        # Count current requests
        current_count = self.redis.zcard(window_key)
        
        if current_count < policy.rate_limit:
            # Add current request
            self.redis.zadd(window_key, {str(current_time): current_time})
            self.redis.expire(window_key, policy.window_size * 2)
            
            return RateLimitResult(
                allowed=True,
                remaining=policy.rate_limit - current_count - 1,
                reset_time=current_time + policy.window_size
            )
        else:
            # Get oldest request time
            oldest_request = self.redis.zrange(window_key, 0, 0, withscores=True)
            if oldest_request:
                reset_time = oldest_request[0][1] + policy.window_size
            else:
                reset_time = current_time + policy.window_size
            
            return RateLimitResult(
                allowed=False,
                remaining=0,
                reset_time=reset_time
            )
```

#### 3. **Fixed Window Algorithm**
```python
class FixedWindowAlgorithm:
    def check_limit(self, key, policy):
        window_key = f"rate_limit:fixed_window:{key}:{policy.id}"
        current_time = int(time.time())
        window_start = (current_time // policy.window_size) * policy.window_size
        
        # Get current window data
        window_data = self.redis.hgetall(window_key)
        
        if not window_data or int(window_data.get("window_start", 0)) != window_start:
            # New window, reset counter
            window_data = {
                "window_start": str(window_start),
                "count": "1"
            }
            self.redis.hmset(window_key, window_data)
            self.redis.expire(window_key, policy.window_size * 2)
            
            return RateLimitResult(
                allowed=True,
                remaining=policy.rate_limit - 1,
                reset_time=window_start + policy.window_size
            )
        else:
            current_count = int(window_data["count"])
            
            if current_count < policy.rate_limit:
                # Increment counter
                self.redis.hincrby(window_key, "count", 1)
                
                return RateLimitResult(
                    allowed=True,
                    remaining=policy.rate_limit - current_count - 1,
                    reset_time=window_start + policy.window_size
                )
            else:
                return RateLimitResult(
                    allowed=False,
                    remaining=0,
                    reset_time=window_start + policy.window_size
                )
```

### 📊 **Policy Store Service**
```python
class PolicyStoreService:
    def __init__(self, db_connection, redis_client):
        self.db = db_connection
        self.redis = redis_client
        self.policy_cache_ttl = 300  # 5 minutes
    
    def get_policy(self, resource_type, key, endpoint):
        # Try cache first
        cache_key = f"policy:{resource_type}:{key}:{endpoint}"
        cached_policy = self.redis.get(cache_key)
        if cached_policy:
            return json.loads(cached_policy)
        
        # Query database for matching policies
        query = """
            SELECT p.*, pa.priority, pa.resource_pattern
            FROM rate_limit_policies p
            JOIN rate_limit_assignments pa ON p.id = pa.policy_id
            WHERE pa.resource_type = %s
            AND pa.is_active = TRUE
            AND p.is_active = TRUE
            ORDER BY pa.priority DESC
        """
        
        policies = self.db.execute(query, (resource_type,))
        
        # Find matching policy
        for policy in policies:
            if self.matches_pattern(key, policy.resource_pattern):
                # Cache the policy
                self.redis.setex(
                    cache_key, 
                    self.policy_cache_ttl, 
                    json.dumps(policy)
                )
                return policy
        
        return None
    
    def matches_pattern(self, key, pattern):
        """Check if key matches the pattern"""
        if pattern == "*":
            return True
        elif pattern.startswith("*"):
            return key.endswith(pattern[1:])
        elif pattern.endswith("*"):
            return key.startswith(pattern[:-1])
        else:
            return key == pattern
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Policy Cache (Redis):
   - Policy configurations: TTL 5 minutes
   - Policy assignments: TTL 5 minutes
   - Rate limit state: TTL based on window size

2. Application Cache:
   - Frequently accessed policies
   - Rate limit decisions for short periods
   - User/IP mappings

3. CDN Cache:
   - Static policy configurations
   - Rate limit headers and responses
```

### 📊 **Memory Optimization**
```
Memory Management:
- Use Redis with appropriate TTL for rate limit state
- Implement LRU eviction for old entries
- Compress rate limit data where possible
- Use efficient data structures (sorted sets for sliding window)
```

### 🔄 **Distributed Rate Limiting**
```
Consistent Hashing:
- Distribute rate limit keys across Redis cluster
- Use consistent hashing for key distribution
- Implement failover and replication

Load Balancing:
- Distribute rate limiting requests across instances
- Use sticky sessions for consistent routing
- Implement health checks and circuit breakers
```

## 🔒 **Security Considerations**

### 🛡️ **Rate Limit Bypass Prevention**
```python
class RateLimitBypassProtection:
    def __init__(self):
        self.suspicious_patterns = [
            "rapid_ip_changes",
            "user_agent_spoofing",
            "request_pattern_anomalies"
        ]
    
    def detect_bypass_attempts(self, key, request_data):
        """Detect potential rate limit bypass attempts"""
        checks = [
            self.check_ip_rotation(key, request_data),
            self.check_user_agent_spoofing(request_data),
            self.check_request_patterns(key, request_data)
        ]
        
        return any(checks)
    
    def check_ip_rotation(self, key, request_data):
        """Check for rapid IP address changes"""
        # Implementation for IP rotation detection
        pass
    
    def check_user_agent_spoofing(self, request_data):
        """Check for user agent spoofing"""
        # Implementation for user agent validation
        pass
```

### 🚫 **Advanced Rate Limiting**
```python
class AdvancedRateLimiter:
    def __init__(self):
        self.adaptive_limits = {}
        self.behavior_analysis = BehaviorAnalysis()
    
    def adaptive_rate_limiting(self, key, request_data):
        """Implement adaptive rate limiting based on behavior"""
        # Analyze user behavior
        behavior_score = self.behavior_analysis.analyze(key, request_data)
        
        # Adjust rate limits based on behavior
        if behavior_score < 0.3:  # Suspicious behavior
            return self.apply_strict_limits(key)
        elif behavior_score > 0.8:  # Good behavior
            return self.apply_relaxed_limits(key)
        else:
            return self.apply_normal_limits(key)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless rate limiter instances
- Auto-scaling based on request volume
- Redis cluster for distributed state
- Load balancer for request distribution

Data Partitioning:
- Partition rate limit data by key hash
- Use consistent hashing for Redis cluster
- Implement data replication for availability
```

### 📊 **Performance Monitoring**
```
Key Metrics:
- Rate limiting decisions per second
- Cache hit rates for policies and state
- Response times for rate limit checks
- Memory usage for rate limit state
- Error rates and timeouts

Alerting:
- High rate limiting decision latency
- Low cache hit rates
- Memory usage approaching limits
- Redis connection issues
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Rate limit violations per minute
- Unique users/IPs being rate limited
- Policy effectiveness and usage
- API endpoint usage patterns

Technical Metrics:
- Rate limiting decision latency (p50, p95, p99)
- Cache hit rates for policies and state
- Memory usage for rate limit data
- Redis cluster performance

Infrastructure Metrics:
- Rate limiter service availability
- Redis cluster health and performance
- Network latency and throughput
- Error rates and timeouts
```

### 🚨 **Alerting Rules**
```
Critical Alerts:
- Rate limiter service down
- Redis cluster connectivity issues
- High rate limiting decision latency (> 50ms)
- Memory usage > 90%

Warning Alerts:
- Cache hit rates < 80%
- High rate limit violation rates
- Unusual traffic patterns
- Policy configuration issues
```

## 🧪 **Testing Strategy**

### ✅ **Test Types**
```
Unit Tests:
- Rate limiting algorithm correctness
- Policy matching and evaluation
- Cache operations and TTL
- Edge cases and boundary conditions

Integration Tests:
- End-to-end rate limiting flow
- Database and cache interactions
- Policy store operations
- Distributed rate limiting

Load Tests:
- High-volume rate limiting decisions
- Concurrent policy lookups
- Redis cluster performance
- Memory usage under load

Security Tests:
- Rate limit bypass attempts
- Policy injection attacks
- Cache poisoning attacks
- Resource exhaustion attacks
```

## 🚀 **Deployment Strategy**

### 📦 **Containerization**
```dockerfile
# Rate Limiter Service Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]
```

### ☁️ **Infrastructure as Code**
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rate-limiter
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rate-limiter
  template:
    metadata:
      labels:
        app: rate-limiter
    spec:
      containers:
      - name: rate-limiter
        image: rate-limiter:latest
        ports:
        - containerPort: 8000
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## 📚 **Additional Considerations**

### 🌍 **Geographic Rate Limiting**
```
Global Rate Limiting:
- Geographic-based rate limiting policies
- Regional rate limit quotas
- Cross-region rate limit synchronization
- Data residency compliance
```

### 🔄 **Rate Limit Synchronization**
```
Distributed Synchronization:
- Cross-datacenter rate limit sync
- Eventual consistency for rate limits
- Conflict resolution strategies
- Backup and recovery procedures
```

### 📊 **Analytics & Insights**
```
Rate Limit Analytics:
- Rate limit violation patterns
- User behavior analysis
- Policy effectiveness metrics
- Performance optimization insights
- Capacity planning data
```

---

**This rate limiter system design provides a scalable, flexible, and high-performance solution for rate limiting at scale. The architecture supports multiple algorithms, distributed deployment, and comprehensive monitoring while maintaining low latency and high accuracy.** 