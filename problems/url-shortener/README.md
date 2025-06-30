# 🔗 URL Shortener System Design

> **Design a URL shortening service like Bitly or TinyURL that can handle millions of URLs and provide analytics.**

## 📋 **Problem Statement**

Design a URL shortening service that allows users to:
- Create short URLs from long URLs
- Redirect users from short URLs to original URLs
- Track click analytics and usage statistics
- Handle high traffic and scale efficiently

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **URL Shortening**: Convert long URLs to short URLs
- **URL Redirection**: Redirect short URLs to original URLs
- **Custom URLs**: Allow users to create custom short URLs
- **Analytics**: Track click counts, geographic data, referrer information
- **User Management**: User registration, authentication, and URL management
- **API Access**: RESTful API for programmatic access

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 100M+ URLs and 1B+ redirects per day
- **Performance**: < 100ms response time for redirects
- **Availability**: 99.9% uptime
- **Durability**: Never lose a URL mapping
- **Security**: Prevent abuse and malicious URLs

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 10M
URLs created per user per day: 2
Total URLs created per day: 20M
URL redirects per day: 1B (50x more reads than writes)
Peak redirects per second: 50K
Storage for URLs: 20M * 500 bytes = 10GB per day
Storage for analytics: 1B * 100 bytes = 100GB per day
```

### 💾 **Storage Requirements**
```
URL Mappings:
- Short URL (7 chars): 7 bytes
- Long URL (500 chars avg): 500 bytes
- User ID (8 bytes): 8 bytes
- Created timestamp (8 bytes): 8 bytes
- Expiration timestamp (8 bytes): 8 bytes
- Total per URL: ~531 bytes

Analytics Data:
- Click timestamp (8 bytes): 8 bytes
- IP address (4 bytes): 4 bytes
- User agent (200 bytes): 200 bytes
- Referrer (200 bytes): 200 bytes
- Geographic data (50 bytes): 50 bytes
- Total per click: ~462 bytes
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   API Client    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Load Balancer        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      API Gateway          │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  URL Service      │  │  Analytics Service│  │  User Service     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Cache Layer          │
                    │      (Redis)              │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database Layer       │
                    │   (PostgreSQL + MongoDB)  │
                    └───────────────────────────┘
```

### 🔄 **Data Flow**
```
1. URL Creation:
   Client → API Gateway → URL Service → Database → Cache

2. URL Redirection:
   Client → Load Balancer → Cache → Database (if not in cache) → Redirect

3. Analytics Collection:
   Client → Analytics Service → Message Queue → Analytics Database
```

## 🗄️ **Database Design**

### 📊 **URL Mappings Table (PostgreSQL)**
```sql
CREATE TABLE url_mappings (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    click_count BIGINT DEFAULT 0,
    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

### 📈 **Analytics Table (MongoDB)**
```javascript
{
  "_id": ObjectId,
  "short_code": "abc123",
  "click_timestamp": ISODate,
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://google.com",
  "country": "US",
  "city": "New York",
  "device_type": "mobile",
  "browser": "Chrome",
  "os": "iOS"
}
```

### 👤 **Users Table (PostgreSQL)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    api_key VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

## 🔧 **Detailed Component Design**

### 🔗 **URL Service**
```python
class URLService:
    def create_short_url(self, long_url, user_id=None, custom_code=None):
        # Validate URL
        if not self.is_valid_url(long_url):
            raise ValueError("Invalid URL")
        
        # Generate short code
        if custom_code:
            if not self.is_code_available(custom_code):
                raise ValueError("Custom code already exists")
            short_code = custom_code
        else:
            short_code = self.generate_unique_code()
        
        # Store in database
        url_mapping = URLMapping(
            short_code=short_code,
            long_url=long_url,
            user_id=user_id
        )
        db.session.add(url_mapping)
        db.session.commit()
        
        # Cache the mapping
        cache.set(f"url:{short_code}", long_url, ttl=86400)
        
        return short_code
    
    def get_long_url(self, short_code):
        # Try cache first
        long_url = cache.get(f"url:{short_code}")
        if long_url:
            return long_url
        
        # Query database
        url_mapping = URLMapping.query.filter_by(
            short_code=short_code, 
            is_active=True
        ).first()
        
        if not url_mapping:
            raise NotFound("URL not found")
        
        # Check expiration
        if url_mapping.expires_at and url_mapping.expires_at < datetime.now():
            raise NotFound("URL expired")
        
        # Cache the result
        cache.set(f"url:{short_code}", url_mapping.long_url, ttl=86400)
        
        return url_mapping.long_url
```

### 📊 **Analytics Service**
```python
class AnalyticsService:
    def track_click(self, short_code, request_data):
        # Create analytics event
        analytics_event = {
            "short_code": short_code,
            "click_timestamp": datetime.now(),
            "ip_address": request_data.get("ip"),
            "user_agent": request_data.get("user_agent"),
            "referrer": request_data.get("referrer"),
            "country": self.get_country_from_ip(request_data.get("ip")),
            "city": self.get_city_from_ip(request_data.get("ip")),
            "device_type": self.get_device_type(request_data.get("user_agent")),
            "browser": self.get_browser(request_data.get("user_agent")),
            "os": self.get_os(request_data.get("user_agent"))
        }
        
        # Send to message queue for async processing
        message_queue.publish("analytics", analytics_event)
        
        # Update click count in cache
        cache.incr(f"clicks:{short_code}")
    
    def get_analytics(self, short_code, user_id):
        # Verify ownership
        if not self.verify_ownership(short_code, user_id):
            raise Unauthorized("Not authorized")
        
        # Get analytics from MongoDB
        analytics = analytics_db.analytics.find({
            "short_code": short_code
        }).sort("click_timestamp", -1)
        
        return self.aggregate_analytics(analytics)
```

### 🔐 **URL Code Generation**
```python
class URLCodeGenerator:
    def __init__(self):
        self.chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        self.base = len(self.chars)
    
    def generate_code(self, length=7):
        """Generate a random short code"""
        return ''.join(random.choice(self.chars) for _ in range(length))
    
    def generate_unique_code(self, length=7):
        """Generate a unique short code with collision handling"""
        max_attempts = 10
        for _ in range(max_attempts):
            code = self.generate_code(length)
            if self.is_code_available(code):
                return code
        
        # If we can't find a unique code, increase length
        return self.generate_unique_code(length + 1)
    
    def is_code_available(self, code):
        """Check if a code is available"""
        return not cache.exists(f"url:{code}") and \
               not URLMapping.query.filter_by(short_code=code).first()
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Application Cache (Redis):
   - URL mappings: TTL 24 hours
   - Click counts: TTL 1 hour
   - User sessions: TTL 30 minutes

2. CDN Cache:
   - Static assets (CSS, JS, images)
   - Frequently accessed short URLs
   - Geographic distribution

3. Browser Cache:
   - Static resources
   - API responses with appropriate headers
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary key on short_code for fast lookups
- Index on user_id for user-specific queries
- Index on expires_at for cleanup operations
- Composite index on (short_code, is_active)

Partitioning:
- Partition analytics table by date
- Archive old analytics data
- Use read replicas for analytics queries
```

### 🔄 **Load Balancing**
```
Load Balancer Configuration:
- Round-robin for even distribution
- Health checks for all services
- SSL termination and compression
- Rate limiting per IP/user
- Geographic routing for global users
```

## 🔒 **Security Considerations**

### 🛡️ **URL Validation**
```python
def validate_url(url):
    """Validate and sanitize URLs"""
    # Check URL format
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Validate URL structure
    try:
        parsed = urlparse(url)
        if not parsed.netloc:
            raise ValueError("Invalid domain")
    except Exception:
        raise ValueError("Invalid URL format")
    
    # Check for malicious URLs
    if is_malicious_url(url):
        raise ValueError("URL blocked for security reasons")
    
    return url

def is_malicious_url(url):
    """Check if URL is malicious"""
    # Check against blacklist
    # Check for phishing indicators
    # Check for malware indicators
    # Use external security services
    return False
```

### 🚫 **Rate Limiting**
```python
class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def is_allowed(self, key, limit, window):
        """Check if request is allowed"""
        current = self.redis.get(key)
        if current and int(current) >= limit:
            return False
        
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, window)
        pipe.execute()
        return True
    
    def limit_url_creation(self, user_id):
        """Limit URL creation per user"""
        key = f"url_creation:{user_id}"
        return self.is_allowed(key, limit=100, window=3600)  # 100 URLs per hour
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless URL service instances
- Auto-scaling based on CPU/memory usage
- Database read replicas for analytics
- Cache clustering for high availability

Data Partitioning:
- Shard URL mappings by short_code hash
- Partition analytics by date
- Use consistent hashing for cache distribution
```

### 📊 **Analytics Processing**
```
Real-time Analytics:
- Stream processing with Apache Kafka
- Real-time aggregation with Apache Flink
- Batch processing for historical data
- Data warehousing for complex queries

Analytics Storage:
- Hot data in MongoDB for real-time queries
- Warm data in PostgreSQL for structured queries
- Cold data in S3 for archival
- Data retention policies and cleanup
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- URLs created per day
- Redirects per day
- Active users
- Conversion rates

Technical Metrics:
- Response time (p50, p95, p99)
- Error rates
- Cache hit rates
- Database connection pool usage

Infrastructure Metrics:
- CPU and memory usage
- Disk I/O and network throughput
- Queue depths and processing times
- Service availability and uptime
```

### 🚨 **Alerting Rules**
```
Critical Alerts:
- Service down or high error rates
- Database connectivity issues
- Cache service failures
- High response times (> 500ms)

Warning Alerts:
- High resource usage (> 80%)
- Low cache hit rates (< 90%)
- Queue depth increasing
- Unusual traffic patterns
```

## 🧪 **Testing Strategy**

### ✅ **Test Types**
```
Unit Tests:
- URL validation and sanitization
- Code generation and uniqueness
- Analytics aggregation
- Rate limiting logic

Integration Tests:
- API endpoints and responses
- Database operations and transactions
- Cache interactions
- Message queue processing

Load Tests:
- High-volume URL creation
- Concurrent redirects
- Analytics processing
- Database performance under load

Security Tests:
- URL injection and XSS
- Rate limiting bypass
- Authentication and authorization
- Data validation and sanitization
```

## 🚀 **Deployment Strategy**

### 📦 **Containerization**
```dockerfile
# URL Service Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

### ☁️ **Infrastructure as Code**
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-service
  template:
    metadata:
      labels:
        app: url-service
    spec:
      containers:
      - name: url-service
        image: url-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

## 📚 **Additional Considerations**

### 🌍 **Geographic Distribution**
```
Global Deployment:
- Multi-region deployment for low latency
- CDN for static content delivery
- Geographic routing for users
- Data residency compliance
```

### 🔄 **Backup & Recovery**
```
Data Backup:
- Automated database backups
- Point-in-time recovery
- Cross-region backup replication
- Disaster recovery procedures
```

### 📊 **Analytics & Insights**
```
Advanced Analytics:
- Click-through rate analysis
- Geographic distribution of clicks
- Referrer analysis and attribution
- User behavior and patterns
- A/B testing for URL optimization
```

---

**This URL shortener system design provides a scalable, secure, and feature-rich solution that can handle millions of URLs and provide comprehensive analytics. The architecture focuses on performance, reliability, and maintainability while considering real-world constraints and requirements.** 