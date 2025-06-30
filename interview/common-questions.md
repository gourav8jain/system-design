# Common System Design Interview Questions

## 🎯 Basic Level Questions

### 1. **Design a URL Shortener (TinyURL)**

**Key Points:**
- URL generation algorithm
- Database schema
- Analytics tracking
- Rate limiting

**Scale Estimation:**
```
- 100M URLs per day
- 10:1 read/write ratio
- 500 bytes per URL
- 50GB storage per day
```

**Core Components:**
- Load Balancer
- Web Servers
- URL Generation Service
- Database (Primary + Replicas)
- Cache (Redis)
- Analytics Service

### 2. **Design a Rate Limiter**

**Key Points:**
- Token bucket vs Leaky bucket
- Distributed rate limiting
- Storage for rate limit data
- Sliding window implementation

**Approaches:**
```
1. Fixed Window Counter
2. Sliding Window Counter
3. Token Bucket Algorithm
4. Leaky Bucket Algorithm
```

### 3. **Design a Chat Application**

**Key Points:**
- Real-time messaging
- Message persistence
- Online/offline status
- Group chats

**Components:**
- WebSocket servers
- Message queue (Kafka/RabbitMQ)
- Database for message history
- Presence service
- Notification service

## 🎯 Intermediate Level Questions

### 4. **Design Twitter Clone**

**Key Points:**
- Feed generation
- Follow/unfollow system
- Tweet composition
- Trending topics

**Scale Estimation:**
```
- 300M users
- 500M tweets per day
- 15K tweets per second
- 200 followers per user (avg)
```

**Core Challenges:**
- Feed generation for millions of users
- Real-time trending calculation
- Media storage and CDN
- Search functionality

### 5. **Design Instagram**

**Key Points:**
- Photo/video upload
- Feed generation
- Stories feature
- Direct messaging

**Components:**
- Media storage (S3/CloudFront)
- Feed service
- Stories service
- Notification service
- Search service

### 6. **Design Uber/Lyft**

**Key Points:**
- Real-time location tracking
- Ride matching algorithm
- Payment processing
- Driver/rider management

**Core Services:**
- Location service
- Matching service
- Payment service
- Notification service
- Analytics service

## 🎯 Advanced Level Questions

### 7. **Design Google Search**

**Key Points:**
- Web crawling
- Indexing
- Ranking algorithm
- Query processing

**Scale:**
```
- 5B+ web pages
- 5B+ searches per day
- 60K queries per second
- Petabytes of data
```

**Components:**
- Web crawlers
- Indexing service
- Ranking service
- Query processing
- Result aggregation

### 8. **Design WhatsApp**

**Key Points:**
- End-to-end encryption
- Message delivery
- Group chats
- Media sharing

**Scale:**
```
- 2B+ users
- 100B+ messages per day
- 1M+ messages per second
```

**Architecture:**
- WebSocket connections
- Message queue
- Encryption service
- Media storage
- Group management

### 9. **Design Amazon**

**Key Points:**
- Product catalog
- Shopping cart
- Order processing
- Recommendation engine

**Services:**
- Product service
- Cart service
- Order service
- Payment service
- Inventory service
- Recommendation service

## 🔧 Technical Deep-Dive Questions

### 10. **Design a Distributed Cache**

**Key Points:**
- Consistent hashing
- Cache invalidation
- Replication strategy
- Partitioning

**Approaches:**
```
1. Memcached (simple key-value)
2. Redis (advanced data structures)
3. Distributed hash table
4. Cache-aside pattern
```

### 11. **Design a Distributed Lock**

**Key Points:**
- Lock acquisition
- Lock release
- Deadlock prevention
- Fault tolerance

**Implementations:**
```
1. Redis SET NX EX
2. Zookeeper
3. Database-based locks
4. Chubby (Google)
```

### 12. **Design a Distributed Counter**

**Key Points:**
- Atomic operations
- Consistency
- Performance
- Fault tolerance

**Approaches:**
```
1. Centralized counter
2. Sharded counters
3. CRDT (Conflict-free Replicated Data Type)
4. Vector clocks
```

## 📊 Data-Intensive Questions

### 13. **Design a Log Aggregation System**

**Key Points:**
- Log collection
- Processing pipeline
- Storage
- Query interface

**Components:**
- Log collectors (Fluentd/Logstash)
- Message queue (Kafka)
- Processing engine (Spark/Flink)
- Storage (HDFS/S3)
- Query engine (Elasticsearch)

### 14. **Design a Recommendation System**

**Key Points:**
- Collaborative filtering
- Content-based filtering
- Real-time recommendations
- A/B testing

**Algorithms:**
```
1. User-based CF
2. Item-based CF
3. Matrix factorization
4. Deep learning models
```

### 15. **Design a Real-time Analytics System**

**Key Points:**
- Data ingestion
- Stream processing
- Real-time queries
- Visualization

**Stack:**
- Kafka (ingestion)
- Spark Streaming/Flink (processing)
- Redis (real-time queries)
- Grafana (visualization)

## 🌐 System Integration Questions

### 16. **Design an API Gateway**

**Key Points:**
- Request routing
- Authentication/Authorization
- Rate limiting
- Monitoring

**Features:**
```
1. Load balancing
2. Circuit breaker
3. Request/Response transformation
4. Logging and monitoring
```

### 17. **Design a Microservices Architecture**

**Key Points:**
- Service decomposition
- Inter-service communication
- Data consistency
- Deployment strategy

**Patterns:**
```
1. API Gateway
2. Service Discovery
3. Circuit Breaker
4. Saga Pattern
5. Event Sourcing
```

### 18. **Design an Event-Driven System**

**Key Points:**
- Event sourcing
- CQRS
- Event store
- Event replay

**Components:**
- Event store
- Event bus
- Event handlers
- Read models
- Write models

## 🔒 Security-Focused Questions

### 19. **Design a Secure Authentication System**

**Key Points:**
- Password hashing
- JWT tokens
- OAuth 2.0
- Multi-factor authentication

**Components:**
- Authentication service
- Token service
- User service
- Audit service

### 20. **Design a Payment System**

**Key Points:**
- Payment processing
- Fraud detection
- Compliance (PCI DSS)
- Idempotency

**Services:**
- Payment gateway
- Fraud detection
- Settlement service
- Reconciliation service

## 📱 Mobile/App Questions

### 21. **Design a Push Notification System**

**Key Points:**
- Device registration
- Message delivery
- Targeting
- Analytics

**Components:**
- Device registry
- Message queue
- Push providers (FCM/APNS)
- Analytics service

### 22. **Design a Mobile App Backend**

**Key Points:**
- API design
- Offline support
- Sync mechanism
- Performance optimization

**Features:**
```
1. RESTful APIs
2. GraphQL
3. WebSocket for real-time
4. CDN for static content
5. Caching strategy
```

## 🎯 Question-Specific Tips

### For Each Question, Always Cover:

1. **Requirements Clarification**
   - Functional requirements
   - Non-functional requirements
   - Scale estimation

2. **High-Level Design**
   - System components
   - Data flow
   - Technology choices

3. **Detailed Design**
   - Database schema
   - API design
   - Component interactions

4. **Scalability Considerations**
   - Horizontal scaling
   - Vertical scaling
   - Caching strategy

5. **Trade-offs Discussion**
   - Pros and cons
   - Alternative approaches
   - Performance implications

## 💡 Sample Answer Framework

### Template for Any Question:

```
1. Clarify Requirements (2-3 min)
   - "Let me understand the requirements..."
   - Ask about scale, features, constraints

2. Estimate Scale (2-3 min)
   - Users, data, traffic
   - Storage, bandwidth needs

3. High-Level Design (5-7 min)
   - Draw system diagram
   - Explain components
   - Show data flow

4. Deep Dive (8-10 min)
   - Database schema
   - API design
   - Key algorithms

5. Discuss Trade-offs (2-3 min)
   - Alternative approaches
   - Pros and cons
   - Performance considerations
```

## 🎉 Pro Tips

1. **Start Simple**: Begin with basic design, then optimize
2. **Show Iteration**: Demonstrate how you'd scale from small to large
3. **Consider Edge Cases**: Think about failure scenarios
4. **Discuss Trade-offs**: Show you understand different approaches
5. **Ask Questions**: Engage with the interviewer
6. **Think Aloud**: Explain your reasoning process

---

**Remember: The goal is to demonstrate your problem-solving approach, not to provide a perfect solution!** 