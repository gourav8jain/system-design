# 🐦 Twitter Clone System Design

> **Design a social media platform like Twitter that can handle millions of users, tweets, and real-time interactions.**

## 📋 **Problem Statement**

Design a Twitter-like platform that allows users to:
- Post tweets (text, images, videos)
- Follow/unfollow other users
- Like, retweet, and reply to tweets
- View real-time timeline feeds
- Search tweets and users
- Send direct messages
- Handle trending topics and hashtags

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Tweet Creation**: Post tweets with text, media, hashtags
- **User Following**: Follow/unfollow other users
- **Timeline Feeds**: Home timeline and user profiles
- **Interactions**: Like, retweet, reply, bookmark
- **Search**: Search tweets, users, hashtags
- **Direct Messages**: Private messaging between users
- **Notifications**: Real-time notifications for interactions
- **Trending Topics**: Discover trending hashtags and topics

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 500M+ users and 1B+ tweets per day
- **Performance**: < 200ms response time for timeline
- **Availability**: 99.9% uptime
- **Real-time**: Instant updates for interactions
- **Search**: Sub-second search response times

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 500M
Tweets per user per day: 5
Total tweets per day: 2.5B
Timeline requests per day: 50B (20x more reads than writes)
Search queries per day: 10B
Media uploads per day: 500M
Storage for tweets: 2.5B * 1KB = 2.5TB per day
Storage for media: 500M * 5MB = 2.5PB per day
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
│  Tweet Service    │  │  Timeline Service │  │  Search Service   │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Event Stream (Kafka)    │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Cache (Redis)        │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Database Layer       │
                    │   (PostgreSQL + MongoDB)  │
                    └───────────────────────────┘
```

## 🗄️ **Database Design**

### 📊 **Tweets Table (PostgreSQL)**
```sql
CREATE TABLE tweets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    mentions TEXT[],
    reply_to_tweet_id BIGINT REFERENCES tweets(id),
    retweet_of_tweet_id BIGINT REFERENCES tweets(id),
    is_retweet BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_hashtags USING GIN (hashtags),
    INDEX idx_mentions USING GIN (mentions)
);

CREATE TABLE user_follows (
    follower_id BIGINT NOT NULL REFERENCES users(id),
    following_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id)
);

CREATE TABLE tweet_interactions (
    tweet_id BIGINT NOT NULL REFERENCES tweets(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    interaction_type VARCHAR(20) NOT NULL, -- 'like', 'retweet', 'bookmark'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tweet_id, user_id, interaction_type)
);
```

## 🔧 **Detailed Component Design**

### 🐦 **Tweet Service**
```python
class TweetService:
    def __init__(self, db_connection, cache_client, event_stream):
        self.db = db_connection
        self.cache = cache_client
        self.event_stream = event_stream
    
    def create_tweet(self, user_id, content, media_urls=None, 
                    reply_to_tweet_id=None, retweet_of_tweet_id=None):
        # Extract hashtags and mentions
        hashtags = self.extract_hashtags(content)
        mentions = self.extract_mentions(content)
        
        # Create tweet
        tweet = Tweet(
            user_id=user_id,
            content=content,
            media_urls=media_urls or [],
            hashtags=hashtags,
            mentions=mentions,
            reply_to_tweet_id=reply_to_tweet_id,
            retweet_of_tweet_id=retweet_of_tweet_id,
            is_retweet=bool(retweet_of_tweet_id)
        )
        
        self.db.session.add(tweet)
        self.db.session.commit()
        
        # Publish event
        self.event_stream.publish('tweet_created', {
            'tweet_id': tweet.id,
            'user_id': user_id,
            'content': content,
            'hashtags': hashtags,
            'mentions': mentions,
            'timestamp': tweet.created_at.isoformat()
        })
        
        return tweet
    
    def like_tweet(self, user_id, tweet_id):
        """Like a tweet"""
        interaction = TweetInteraction(
            tweet_id=tweet_id,
            user_id=user_id,
            interaction_type='like'
        )
        
        self.db.session.add(interaction)
        self.db.session.commit()
        
        # Publish event
        self.event_stream.publish('tweet_liked', {
            'tweet_id': tweet_id,
            'user_id': user_id,
            'timestamp': datetime.now().isoformat()
        })
        
        return interaction
```

### 📰 **Timeline Service**
```python
class TimelineService:
    def __init__(self, db_connection, cache_client, event_stream):
        self.db = db_connection
        self.cache = cache_client
        self.event_stream = event_stream
    
    def get_home_timeline(self, user_id, page=1, limit=20):
        """Get home timeline for user"""
        # Try cache first
        cache_key = f"timeline:{user_id}:{page}"
        cached_timeline = self.cache.get(cache_key)
        if cached_timeline:
            return json.loads(cached_timeline)
        
        # Get followed users
        followed_users = self.get_followed_users(user_id)
        
        # Query tweets from followed users
        offset = (page - 1) * limit
        tweets = self.db.session.query(Tweet).filter(
            Tweet.user_id.in_(followed_users)
        ).order_by(Tweet.created_at.desc()).offset(offset).limit(limit).all()
        
        # Enrich tweets with interaction counts
        enriched_tweets = self.enrich_tweets(tweets)
        
        # Cache results
        self.cache.set(cache_key, json.dumps(enriched_tweets), ttl=300)
        
        return enriched_tweets
    
    def get_user_timeline(self, user_id, target_user_id, page=1, limit=20):
        """Get timeline for specific user"""
        cache_key = f"user_timeline:{target_user_id}:{page}"
        cached_timeline = self.cache.get(cache_key)
        if cached_timeline:
            return json.loads(cached_timeline)
        
        # Query tweets from user
        offset = (page - 1) * limit
        tweets = self.db.session.query(Tweet).filter(
            Tweet.user_id == target_user_id
        ).order_by(Tweet.created_at.desc()).offset(offset).limit(limit).all()
        
        # Enrich tweets
        enriched_tweets = self.enrich_tweets(tweets)
        
        # Cache results
        self.cache.set(cache_key, json.dumps(enriched_tweets), ttl=300)
        
        return enriched_tweets
```

### 🔍 **Search Service**
```python
class SearchService:
    def __init__(self, elasticsearch_client, cache_client):
        self.es = elasticsearch_client
        self.cache = cache_client
    
    def search_tweets(self, query, filters=None, page=1, limit=20):
        """Search tweets using Elasticsearch"""
        cache_key = f"search:{hash(query)}:{page}"
        cached_results = self.cache.get(cache_key)
        if cached_results:
            return json.loads(cached_results)
        
        # Build search query
        search_body = {
            "query": {
                "bool": {
                    "must": [
                        {"multi_match": {
                            "query": query,
                            "fields": ["content", "hashtags", "mentions"]
                        }}
                    ]
                }
            },
            "sort": [{"created_at": {"order": "desc"}}],
            "from": (page - 1) * limit,
            "size": limit
        }
        
        # Add filters
        if filters:
            if filters.get('user_id'):
                search_body["query"]["bool"]["filter"] = [
                    {"term": {"user_id": filters['user_id']}}
                ]
            if filters.get('date_range'):
                search_body["query"]["bool"]["filter"] = [
                    {"range": {"created_at": filters['date_range']}}
                ]
        
        # Execute search
        results = self.es.search(index="tweets", body=search_body)
        
        # Process results
        tweets = [hit['_source'] for hit in results['hits']['hits']]
        
        # Cache results
        self.cache.set(cache_key, json.dumps(tweets), ttl=600)
        
        return {
            'tweets': tweets,
            'total': results['hits']['total']['value']
        }
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Timeline Cache (Redis):
   - User timelines: TTL 5 minutes
   - Home timelines: TTL 5 minutes
   - Tweet interactions: TTL 1 hour

2. Search Cache (Redis):
   - Search results: TTL 10 minutes
   - Trending topics: TTL 1 hour
   - User suggestions: TTL 30 minutes

3. CDN Cache:
   - Media files and images
   - Static assets
   - Geographic distribution
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary key on tweet ID for fast lookups
- Composite indexes for timeline queries
- Full-text search indexes for content
- GIN indexes for hashtags and mentions

Partitioning:
- Partition tweets table by date
- Partition interactions by tweet_id
- Use read replicas for timeline queries
```

## 🔒 **Security Considerations**

### 🛡️ **Content Moderation**
```python
class ContentModeration:
    def __init__(self):
        self.spam_detector = SpamDetector()
        self.toxicity_classifier = ToxicityClassifier()
    
    def moderate_tweet(self, content, user_id):
        """Moderate tweet content"""
        checks = [
            self.check_spam(content, user_id),
            self.check_toxicity(content),
            self.check_violations(content)
        ]
        
        if any(checks):
            return {'approved': False, 'reason': 'Content violates guidelines'}
        
        return {'approved': True}
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless tweet service instances
- Timeline service with read replicas
- Search service with Elasticsearch cluster
- Cache clustering for high availability

Data Partitioning:
- Shard tweets by user_id
- Partition timelines by user
- Use consistent hashing for cache distribution
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Tweets posted per day
- User engagement rates
- Timeline load times
- Search query performance

Technical Metrics:
- Response time (p50, p95, p99)
- Error rates and availability
- Cache hit rates
- Database query performance
```

---

**This Twitter clone system design provides a scalable, real-time social media platform with comprehensive features for user interactions, content discovery, and search capabilities.** 