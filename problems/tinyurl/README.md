# 🔗 TinyURL System Design

> **Design a URL shortening service with advanced analytics, custom domains, and enterprise features like Bitly Pro.**

## 📋 **Problem Statement**

Design a TinyURL service that allows users to:
- Create short URLs from long URLs
- Track detailed analytics and click data
- Use custom domains and branded links
- Manage link campaigns and A/B testing
- Provide enterprise features and API access
- Handle high traffic with advanced caching

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **URL Shortening**: Convert long URLs to short URLs
- **Custom Domains**: Support for branded domains
- **Advanced Analytics**: Click tracking, geographic data, device info
- **Campaign Management**: Organize links into campaigns
- **A/B Testing**: Test different destination URLs
- **API Access**: RESTful API with rate limiting
- **User Management**: Teams, roles, and permissions
- **Link Expiration**: Set expiration dates for links

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 500M+ URLs and 10B+ redirects per day
- **Performance**: < 50ms response time for redirects
- **Availability**: 99.99% uptime
- **Analytics**: Real-time data processing
- **Security**: Link validation and abuse prevention

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 50M
URLs created per user per day: 5
Total URLs created per day: 250M
URL redirects per day: 10B (40x more reads than writes)
Peak redirects per second: 200K
Analytics events per day: 50B (5x more than redirects)
Storage for URLs: 250M * 1KB = 250GB per day
Storage for analytics: 50B * 200 bytes = 10TB per day
```

### 💾 **Storage Requirements**
```
URL Mappings:
- Short URL (7 chars): 7 bytes
- Long URL (1000 chars avg): 1000 bytes
- Custom domain (100 chars): 100 bytes
- User ID (8 bytes): 8 bytes
- Campaign ID (8 bytes): 8 bytes
- A/B test config (500 bytes): 500 bytes
- Created timestamp (8 bytes): 8 bytes
- Expiration timestamp (8 bytes): 8 bytes
- Total per URL: ~1.6KB

Analytics Data:
- Click timestamp (8 bytes): 8 bytes
- IP address (4 bytes): 4 bytes
- User agent (300 bytes): 300 bytes
- Referrer (300 bytes): 300 bytes
- Geographic data (100 bytes): 100 bytes
- Device info (200 bytes): 200 bytes
- Campaign data (100 bytes): 100 bytes
- Total per click: ~1KB
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
│  URL Service      │  │  Analytics Service│  │  Campaign Service │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Event Stream (Kafka)    │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Cache Layer          │
                    │      (Redis + CDN)        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database Layer       │
                    │   (PostgreSQL + ClickHouse)│
                    └───────────────────────────┘
```

### 🔄 **Data Flow**
```
1. URL Creation:
   Client → API Gateway → URL Service → Database → Cache → Event Stream

2. URL Redirection:
   Client → Load Balancer → Cache → Database (if not in cache) → Analytics → Redirect

3. Analytics Processing:
   Analytics Service → Event Stream → Real-time Processing → ClickHouse

4. Campaign Management:
   Client → Campaign Service → Database → Cache → Analytics Dashboard
```

## 🗄️ **Database Design**

### 📊 **URL Mappings Table (PostgreSQL)**
```sql
CREATE TABLE url_mappings (
    id BIGSERIAL PRIMARY KEY,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    custom_domain VARCHAR(100),
    user_id BIGINT REFERENCES users(id),
    campaign_id BIGINT REFERENCES campaigns(id),
    title VARCHAR(200),
    description TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    click_count BIGINT DEFAULT 0,
    unique_click_count BIGINT DEFAULT 0,
    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id),
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_custom_domain (custom_domain),
    INDEX idx_expires_at (expires_at)
);

CREATE TABLE campaigns (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ab_tests (
    id BIGSERIAL PRIMARY KEY,
    url_mapping_id BIGINT REFERENCES url_mappings(id),
    variant_a_url TEXT NOT NULL,
    variant_b_url TEXT NOT NULL,
    traffic_split DECIMAL(3,2) DEFAULT 0.5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📈 **Analytics Tables (ClickHouse)**
```sql
-- Click events table
CREATE TABLE click_events (
    id UUID,
    short_code String,
    long_url String,
    user_id UInt64,
    campaign_id UInt64,
    ip_address IPv4,
    user_agent String,
    referrer String,
    country String,
    city String,
    device_type String,
    browser String,
    os String,
    timestamp DateTime,
    session_id String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (short_code, timestamp);

-- Daily aggregations
CREATE TABLE daily_click_aggregations (
    date Date,
    short_code String,
    total_clicks UInt64,
    unique_clicks UInt64,
    countries Array(String),
    devices Array(String),
    browsers Array(String)
) ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (short_code, date);
```

### 👤 **Users and Teams Table (PostgreSQL)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    company VARCHAR(100),
    plan_type VARCHAR(20) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    api_key VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    team_id BIGINT NOT NULL REFERENCES teams(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id)
);
```

## 🔧 **Detailed Component Design**

### 🔗 **URL Service**
```python
class URLService:
    def __init__(self, db_connection, cache_client, event_stream):
        self.db = db_connection
        self.cache = cache_client
        self.event_stream = event_stream
    
    def create_short_url(self, long_url, user_id, custom_code=None, 
                        custom_domain=None, campaign_id=None, title=None):
        # Validate URL and custom domain
        if not self.is_valid_url(long_url):
            raise ValueError("Invalid URL")
        
        if custom_domain and not self.is_valid_domain(custom_domain):
            raise ValueError("Invalid custom domain")
        
        # Generate short code
        if custom_code:
            if not self.is_code_available(custom_code, custom_domain):
                raise ValueError("Custom code already exists")
            short_code = custom_code
        else:
            short_code = self.generate_unique_code()
        
        # Create URL mapping
        url_mapping = URLMapping(
            short_code=short_code,
            long_url=long_url,
            custom_domain=custom_domain,
            user_id=user_id,
            campaign_id=campaign_id,
            title=title
        )
        
        self.db.session.add(url_mapping)
        self.db.session.commit()
        
        # Cache the mapping
        cache_key = f"url:{custom_domain}:{short_code}" if custom_domain else f"url:{short_code}"
        self.cache.set(cache_key, long_url, ttl=86400)
        
        # Publish event
        self.event_stream.publish('url_created', {
            'url_id': url_mapping.id,
            'short_code': short_code,
            'long_url': long_url,
            'user_id': user_id,
            'campaign_id': campaign_id
        })
        
        return url_mapping
    
    def get_long_url(self, short_code, custom_domain=None, request_data=None):
        # Try cache first
        cache_key = f"url:{custom_domain}:{short_code}" if custom_domain else f"url:{short_code}"
        long_url = self.cache.get(cache_key)
        
        if not long_url:
            # Query database
            query = self.db.session.query(URLMapping).filter_by(
                short_code=short_code,
                is_active=True
            )
            
            if custom_domain:
                query = query.filter_by(custom_domain=custom_domain)
            
            url_mapping = query.first()
            
            if not url_mapping:
                raise NotFound("URL not found")
            
            # Check expiration
            if url_mapping.expires_at and url_mapping.expires_at < datetime.now():
                raise NotFound("URL expired")
            
            long_url = url_mapping.long_url
            
            # Cache the result
            self.cache.set(cache_key, long_url, ttl=86400)
        
        # Track click event
        if request_data:
            self.track_click(short_code, custom_domain, request_data)
        
        return long_url
    
    def track_click(self, short_code, custom_domain, request_data):
        """Track click event asynchronously"""
        click_event = {
            'short_code': short_code,
            'custom_domain': custom_domain,
            'ip_address': request_data.get('ip'),
            'user_agent': request_data.get('user_agent'),
            'referrer': request_data.get('referrer'),
            'timestamp': datetime.now().isoformat(),
            'session_id': request_data.get('session_id')
        }
        
        # Publish to event stream
        self.event_stream.publish('click_event', click_event)
```

### 📊 **Analytics Service**
```python
class AnalyticsService:
    def __init__(self, clickhouse_client, cache_client):
        self.clickhouse = clickhouse_client
        self.cache = cache_client
    
    def process_click_event(self, click_event):
        """Process click event and store in ClickHouse"""
        # Enrich with geographic and device data
        enriched_event = self.enrich_event(click_event)
        
        # Insert into ClickHouse
        self.clickhouse.execute("""
            INSERT INTO click_events (
                id, short_code, long_url, user_id, campaign_id,
                ip_address, user_agent, referrer, country, city,
                device_type, browser, os, timestamp, session_id
            ) VALUES (
                %(id)s, %(short_code)s, %(long_url)s, %(user_id)s, %(campaign_id)s,
                %(ip_address)s, %(user_agent)s, %(referrer)s, %(country)s, %(city)s,
                %(device_type)s, %(browser)s, %(os)s, %(timestamp)s, %(session_id)s
            )
        """, enriched_event)
        
        # Update real-time counters
        self.update_realtime_counters(click_event['short_code'])
    
    def enrich_event(self, click_event):
        """Enrich click event with additional data"""
        ip_address = click_event['ip_address']
        
        return {
            **click_event,
            'id': str(uuid.uuid4()),
            'country': self.get_country_from_ip(ip_address),
            'city': self.get_city_from_ip(ip_address),
            'device_type': self.get_device_type(click_event['user_agent']),
            'browser': self.get_browser(click_event['user_agent']),
            'os': self.get_os(click_event['user_agent'])
        }
    
    def get_analytics(self, short_code, user_id, date_range=None):
        """Get analytics for a specific URL"""
        # Verify ownership
        if not self.verify_ownership(short_code, user_id):
            raise Unauthorized("Not authorized")
        
        # Try cache first
        cache_key = f"analytics:{short_code}:{date_range}"
        cached_analytics = self.cache.get(cache_key)
        if cached_analytics:
            return json.loads(cached_analytics)
        
        # Query ClickHouse
        query = """
            SELECT 
                toDate(timestamp) as date,
                count() as total_clicks,
                uniq(session_id) as unique_clicks,
                uniq(ip_address) as unique_visitors,
                groupArray(DISTINCT country) as countries,
                groupArray(DISTINCT device_type) as devices,
                groupArray(DISTINCT browser) as browsers
            FROM click_events
            WHERE short_code = %(short_code)s
        """
        
        if date_range:
            query += " AND timestamp >= %(start_date)s AND timestamp <= %(end_date)s"
        
        query += " GROUP BY date ORDER BY date"
        
        results = self.clickhouse.execute(query, {
            'short_code': short_code,
            'start_date': date_range['start'] if date_range else None,
            'end_date': date_range['end'] if date_range else None
        })
        
        # Cache results
        self.cache.set(cache_key, json.dumps(results), ttl=3600)
        
        return results
```

### 🎯 **Campaign Service**
```python
class CampaignService:
    def __init__(self, db_connection, cache_client):
        self.db = db_connection
        self.cache = cache_client
    
    def create_campaign(self, name, description, user_id, team_id=None):
        """Create a new campaign"""
        campaign = Campaign(
            name=name,
            description=description,
            user_id=user_id
        )
        
        self.db.session.add(campaign)
        self.db.session.commit()
        
        return campaign
    
    def add_url_to_campaign(self, url_id, campaign_id, user_id):
        """Add URL to campaign"""
        # Verify ownership
        if not self.verify_campaign_ownership(campaign_id, user_id):
            raise Unauthorized("Not authorized")
        
        url_mapping = self.db.session.query(URLMapping).filter_by(id=url_id).first()
        if not url_mapping:
            raise NotFound("URL not found")
        
        url_mapping.campaign_id = campaign_id
        self.db.session.commit()
        
        return url_mapping
    
    def get_campaign_analytics(self, campaign_id, user_id, date_range=None):
        """Get analytics for entire campaign"""
        # Verify ownership
        if not self.verify_campaign_ownership(campaign_id, user_id):
            raise Unauthorized("Not authorized")
        
        # Get all URLs in campaign
        urls = self.db.session.query(URLMapping).filter_by(
            campaign_id=campaign_id
        ).all()
        
        # Aggregate analytics
        total_clicks = sum(url.click_count for url in urls)
        total_unique_clicks = sum(url.unique_click_count for url in urls)
        
        return {
            'campaign_id': campaign_id,
            'total_urls': len(urls),
            'total_clicks': total_clicks,
            'total_unique_clicks': total_unique_clicks,
            'urls': [{'id': url.id, 'short_code': url.short_code, 
                     'clicks': url.click_count} for url in urls]
        }
```

### 🔄 **A/B Testing Service**
```python
class ABTestingService:
    def __init__(self, db_connection, cache_client):
        self.db = db_connection
        self.cache = cache_client
    
    def create_ab_test(self, url_mapping_id, variant_a_url, variant_b_url, 
                      traffic_split=0.5, user_id=None):
        """Create A/B test for URL"""
        # Verify ownership
        if not self.verify_url_ownership(url_mapping_id, user_id):
            raise Unauthorized("Not authorized")
        
        ab_test = ABTest(
            url_mapping_id=url_mapping_id,
            variant_a_url=variant_a_url,
            variant_b_url=variant_b_url,
            traffic_split=traffic_split
        )
        
        self.db.session.add(ab_test)
        self.db.session.commit()
        
        return ab_test
    
    def get_variant_url(self, short_code, session_id):
        """Get A/B test variant URL for session"""
        # Check if A/B test exists
        ab_test = self.db.session.query(ABTest).join(URLMapping).filter(
            URLMapping.short_code == short_code,
            ABTest.is_active == True
        ).first()
        
        if not ab_test:
            return None
        
        # Determine variant based on session
        cache_key = f"ab_test:{session_id}:{short_code}"
        variant = self.cache.get(cache_key)
        
        if not variant:
            # Assign variant based on traffic split
            if random.random() < ab_test.traffic_split:
                variant = 'A'
            else:
                variant = 'B'
            
            self.cache.set(cache_key, variant, ttl=3600)  # 1 hour
        
        return ab_test.variant_a_url if variant == 'A' else ab_test.variant_b_url
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. URL Cache (Redis):
   - URL mappings: TTL 24 hours
   - A/B test assignments: TTL 1 hour
   - User sessions: TTL 30 minutes

2. Analytics Cache (Redis):
   - Real-time counters: TTL 5 minutes
   - Aggregated analytics: TTL 1 hour
   - Campaign data: TTL 30 minutes

3. CDN Cache:
   - Static assets and branding
   - Frequently accessed short URLs
   - Geographic distribution
```

### 📊 **Database Optimization**
```
PostgreSQL Optimization:
- Primary key on short_code for fast lookups
- Composite indexes for complex queries
- Partitioning by date for large tables
- Read replicas for analytics queries

ClickHouse Optimization:
- Columnar storage for analytics
- Partitioning by month for click events
- Materialized views for aggregations
- Compression for storage efficiency
```

### 🔄 **Event Stream Processing**
```
Kafka Configuration:
- Multiple partitions for parallel processing
- Consumer groups for load distribution
- Retention policies for data management
- Dead letter queues for failed events
```

## 🔒 **Security Considerations**

### 🛡️ **Link Validation**
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
    
    # Check for spam indicators
    if is_spam_url(url):
        raise ValueError("URL appears to be spam")
    
    return url

def is_malicious_url(url):
    """Check if URL is malicious"""
    # Check against blacklist
    # Check for phishing indicators
    # Check for malware indicators
    # Use external security services
    return False
```

### 🚫 **Rate Limiting and Abuse Prevention**
```python
class AbusePrevention:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def check_abuse(self, user_id, ip_address, action):
        """Check for abusive behavior"""
        checks = [
            self.check_rate_limit(user_id, action),
            self.check_ip_abuse(ip_address, action),
            self.check_pattern_abuse(user_id, action)
        ]
        
        return any(checks)
    
    def check_rate_limit(self, user_id, action):
        """Check rate limits for user"""
        key = f"rate_limit:{user_id}:{action}"
        current = self.redis.get(key)
        
        limits = {
            'url_creation': 1000,  # URLs per hour
            'api_calls': 10000,    # API calls per hour
            'analytics_queries': 1000  # Queries per hour
        }
        
        if current and int(current) >= limits.get(action, 100):
            return True
        
        self.redis.incr(key)
        self.redis.expire(key, 3600)
        return False
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless URL service instances
- Auto-scaling based on traffic patterns
- Database read replicas for analytics
- Cache clustering for high availability

Data Partitioning:
- Shard URL mappings by short_code hash
- Partition analytics by date and region
- Use consistent hashing for cache distribution
```

### 📊 **Analytics Processing**
```
Real-time Analytics:
- Stream processing with Apache Kafka
- Real-time aggregation with Apache Flink
- Batch processing for historical data
- Data warehousing with ClickHouse

Analytics Storage:
- Hot data in ClickHouse for real-time queries
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
- Campaign performance
- User engagement and retention

Technical Metrics:
- Response time (p50, p95, p99)
- Error rates and availability
- Cache hit rates
- Database query performance

Infrastructure Metrics:
- Service availability and uptime
- Memory and CPU usage
- Network bandwidth and latency
- Storage usage and growth
```

### 🚨 **Alerting Rules**
```
Critical Alerts:
- Service down or high error rates
- Database connectivity issues
- Cache service failures
- High response times (> 100ms)

Warning Alerts:
- High resource usage (> 80%)
- Low cache hit rates (< 90%)
- Unusual traffic patterns
- Analytics processing delays
```

## 🧪 **Testing Strategy**

### ✅ **Test Types**
```
Unit Tests:
- URL validation and sanitization
- Analytics aggregation
- A/B test logic
- Campaign management

Integration Tests:
- End-to-end URL creation and redirection
- Analytics event processing
- Campaign analytics
- API endpoints and responses

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
# TinyURL Service Dockerfile
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
  name: tinyurl-service
spec:
  replicas: 5
  selector:
    matchLabels:
      app: tinyurl-service
  template:
    metadata:
      labels:
        app: tinyurl-service
    spec:
      containers:
      - name: tinyurl-service
        image: tinyurl-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: CLICKHOUSE_URL
          valueFrom:
            secretKeyRef:
              name: clickhouse-secret
              key: url
```

## 📚 **Additional Considerations**

### 🌍 **Geographic Distribution**
```
Global Deployment:
- Multi-region deployment for low latency
- Regional analytics processing
- Cross-region data synchronization
- CDN for global content delivery
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
- Device and browser analytics
- Campaign performance insights
- A/B testing results and optimization
```

---

**This TinyURL system design provides a comprehensive, scalable, and feature-rich solution for URL shortening with advanced analytics. The architecture focuses on performance, reliability, and enterprise features while supporting massive scale and real-time analytics processing.** 