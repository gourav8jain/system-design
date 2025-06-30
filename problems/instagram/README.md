# 📸 Instagram System Design

> **Design a social media platform like Instagram that can handle millions of photos, videos, stories, and real-time social interactions with advanced content discovery and recommendation systems.**

## 📋 **Problem Statement**

Design an Instagram-like platform that can:
- Handle millions of photo and video uploads per day
- Support stories, reels, and live streaming
- Provide real-time feed updates and notifications
- Enable social interactions (likes, comments, follows)
- Offer advanced content discovery and recommendations
- Support direct messaging and group chats
- Handle hashtags, locations, and search functionality
- Provide analytics and insights for creators

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Content Creation**: Photo/video upload, stories, reels, live streaming
- **Social Features**: Follow/unfollow, likes, comments, shares
- **Content Discovery**: Feed, explore page, hashtags, locations
- **Messaging**: Direct messages, group chats, stories replies
- **Search**: User search, hashtag search, location-based search
- **Analytics**: Creator insights, engagement metrics, reach analytics
- **Monetization**: Ads, sponsored content, shopping features
- **Privacy**: Private accounts, close friends, content controls

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 500M+ users and 100M+ posts per day
- **Performance**: < 2s for feed loading, < 1s for interactions
- **Availability**: 99.9% uptime
- **Real-time**: Instant notifications and live updates
- **Media**: Support high-quality photos and videos
- **Global**: Multi-region content delivery

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 500M
Posts per user per day: 2
Total posts per day: 1B
Stories per user per day: 5
Total stories per day: 2.5B
Feed views per day: 50B (50x more reads than writes)
Search queries per day: 10B
Direct messages per day: 5B
Storage for posts: 1B * 10MB = 10PB per day
Storage for stories: 2.5B * 5MB = 12.5PB per day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   Creator Tools  │
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
│  Content Service  │  │   Feed Service    │  │  Social Service   │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Media Processing        │
                    │   (Image/Video)           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Content Delivery        │
                    │   Network (CDN)           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Search & Discovery      │
                    │         Service           │
                    └─────────────┬─────────────┘
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

### 📊 **Posts Table (PostgreSQL)**
```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    post_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    content_type VARCHAR(20) NOT NULL, -- 'photo', 'video', 'carousel'
    caption TEXT,
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    hashtags TEXT[],
    mentions TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_hashtags USING GIN (hashtags),
    INDEX idx_location (latitude, longitude)
);

CREATE TABLE post_media (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
    media_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for videos in seconds
    file_size BIGINT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id)
);

CREATE TABLE stories (
    id BIGSERIAL PRIMARY KEY,
    story_id VARCHAR(100) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
    media_url VARCHAR(500) NOT NULL,
    caption TEXT,
    hashtags TEXT[],
    mentions TEXT[],
    location VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    INDEX idx_story_id (story_id),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);
```

### 👥 **Social Interactions Table (PostgreSQL)**
```sql
CREATE TABLE user_follows (
    follower_id BIGINT NOT NULL REFERENCES users(id),
    following_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id)
);

CREATE TABLE post_likes (
    post_id BIGINT NOT NULL REFERENCES posts(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id)
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    parent_comment_id BIGINT REFERENCES comments(id),
    content TEXT NOT NULL,
    mentions TEXT[],
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment_id (parent_comment_id)
);

CREATE TABLE story_views (
    story_id BIGINT NOT NULL REFERENCES stories(id),
    viewer_id BIGINT NOT NULL REFERENCES users(id),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, viewer_id),
    INDEX idx_story_id (story_id),
    INDEX idx_viewer_id (viewer_id)
);
```

### 🔍 **Search & Discovery Table (Elasticsearch)**
```json
{
  "mappings": {
    "properties": {
      "post_id": {"type": "keyword"},
      "user_id": {"type": "long"},
      "content_type": {"type": "keyword"},
      "caption": {"type": "text", "analyzer": "standard"},
      "hashtags": {"type": "keyword"},
      "mentions": {"type": "keyword"},
      "location": {"type": "geo_point"},
      "created_at": {"type": "date"},
      "like_count": {"type": "integer"},
      "comment_count": {"type": "integer"},
      "view_count": {"type": "long"},
      "user_followers_count": {"type": "integer"},
      "user_verified": {"type": "boolean"}
    }
  }
}
```

## 🔧 **Detailed Component Design**

### 📸 **Content Service**
```python
class ContentService:
    def __init__(self, db_connection, media_processor, cache_client, event_stream):
        self.db = db_connection
        self.media_processor = media_processor
        self.cache = cache_client
        self.event_stream = event_stream
    
    def create_post(self, user_id, media_files, caption=None, location=None, 
                   hashtags=None, mentions=None):
        """Create a new post"""
        # Generate post ID
        post_id = self.generate_post_id()
        
        # Process media files
        processed_media = []
        for media_file in media_files:
            processed = self.media_processor.process_media(media_file)
            processed_media.append(processed)
        
        # Create post record
        post = Post(
            post_id=post_id,
            user_id=user_id,
            content_type='carousel' if len(media_files) > 1 else 'photo',
            caption=caption,
            location=location,
            hashtags=hashtags or [],
            mentions=mentions or []
        )
        
        self.db.session.add(post)
        self.db.session.flush()
        
        # Create media records
        for i, media in enumerate(processed_media):
            post_media = PostMedia(
                post_id=post.id,
                media_type=media['type'],
                media_url=media['url'],
                thumbnail_url=media.get('thumbnail_url'),
                width=media.get('width'),
                height=media.get('height'),
                duration=media.get('duration'),
                file_size=media.get('file_size'),
                sort_order=i
            )
            self.db.session.add(post_media)
        
        self.db.session.commit()
        
        # Publish event
        self.event_stream.publish('post_created', {
            'post_id': post_id,
            'user_id': user_id,
            'content_type': post.content_type,
            'hashtags': hashtags,
            'timestamp': post.created_at.isoformat()
        })
        
        return post
    
    def create_story(self, user_id, media_file, caption=None, hashtags=None, 
                    mentions=None, location=None):
        """Create a new story"""
        # Generate story ID
        story_id = self.generate_story_id()
        
        # Process media file
        processed_media = self.media_processor.process_story_media(media_file)
        
        # Create story record
        story = Story(
            story_id=story_id,
            user_id=user_id,
            media_type=processed_media['type'],
            media_url=processed_media['url'],
            caption=caption,
            hashtags=hashtags or [],
            mentions=mentions or [],
            location=location
        )
        
        self.db.session.add(story)
        self.db.session.commit()
        
        # Publish event
        self.event_stream.publish('story_created', {
            'story_id': story_id,
            'user_id': user_id,
            'timestamp': story.created_at.isoformat()
        })
        
        return story
    
    def like_post(self, user_id, post_id):
        """Like a post"""
        # Check if already liked
        existing_like = self.db.session.query(PostLike).filter_by(
            post_id=post_id,
            user_id=user_id
        ).first()
        
        if existing_like:
            return existing_like
        
        # Create like
        like = PostLike(
            post_id=post_id,
            user_id=user_id
        )
        
        self.db.session.add(like)
        
        # Update post like count
        post = self.db.session.query(Post).filter_by(id=post_id).first()
        post.like_count += 1
        
        self.db.session.commit()
        
        # Publish event
        self.event_stream.publish('post_liked', {
            'post_id': post_id,
            'user_id': user_id,
            'timestamp': like.created_at.isoformat()
        })
        
        return like
```

### 📰 **Feed Service**
```python
class FeedService:
    def __init__(self, db_connection, cache_client, recommendation_service):
        self.db = db_connection
        self.cache = cache_client
        self.recommendation = recommendation_service
    
    def get_user_feed(self, user_id, page=1, limit=20):
        """Get personalized feed for user"""
        # Try cache first
        cache_key = f"feed:{user_id}:{page}"
        cached_feed = self.cache.get(cache_key)
        
        if cached_feed:
            return json.loads(cached_feed)
        
        # Get followed users
        followed_users = self.get_followed_users(user_id)
        
        # Get posts from followed users
        posts = self.db.session.query(Post).filter(
            Post.user_id.in_(followed_users),
            Post.is_public == True,
            Post.is_archived == False
        ).order_by(Post.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        
        # Enrich posts with media and user info
        enriched_posts = self.enrich_posts(posts, user_id)
        
        # Cache results
        self.cache.set(cache_key, json.dumps(enriched_posts), ttl=300)
        
        return enriched_posts
    
    def get_explore_feed(self, user_id, page=1, limit=20):
        """Get explore feed with recommended content"""
        # Get personalized recommendations
        recommended_posts = self.recommendation.get_recommended_posts(user_id, limit)
        
        # Enrich posts
        enriched_posts = self.enrich_posts(recommended_posts, user_id)
        
        return enriched_posts
    
    def enrich_posts(self, posts, user_id):
        """Enrich posts with additional data"""
        enriched = []
        
        for post in posts:
            # Get media
            media = self.get_post_media(post.id)
            
            # Get user info
            user = self.get_user_info(post.user_id)
            
            # Check if user liked the post
            is_liked = self.check_user_liked(post.id, user_id)
            
            # Check if user saved the post
            is_saved = self.check_user_saved(post.id, user_id)
            
            enriched.append({
                'id': post.post_id,
                'user': user,
                'content_type': post.content_type,
                'caption': post.caption,
                'location': post.location,
                'hashtags': post.hashtags,
                'media': media,
                'like_count': post.like_count,
                'comment_count': post.comment_count,
                'is_liked': is_liked,
                'is_saved': is_saved,
                'created_at': post.created_at.isoformat()
            })
        
        return enriched
```

### 🔍 **Search & Discovery Service**
```python
class SearchService:
    def __init__(self, elasticsearch_client, cache_client):
        self.es = elasticsearch_client
        self.cache = cache_client
    
    def search_posts(self, query, filters=None, page=1, limit=20):
        """Search posts using Elasticsearch"""
        # Build search query
        search_body = {
            "query": {
                "bool": {
                    "must": [
                        {"multi_match": {
                            "query": query,
                            "fields": ["caption^3", "hashtags^2", "mentions"]
                        }}
                    ],
                    "filter": [
                        {"term": {"is_public": True}},
                        {"term": {"is_archived": False}}
                    ]
                }
            },
            "sort": [{"created_at": {"order": "desc"}}],
            "from": (page - 1) * limit,
            "size": limit
        }
        
        # Add filters
        if filters:
            if filters.get('content_type'):
                search_body["query"]["bool"]["filter"].append(
                    {"term": {"content_type": filters['content_type']}}
                )
            if filters.get('date_range'):
                search_body["query"]["bool"]["filter"].append(
                    {"range": {"created_at": filters['date_range']}}
                )
        
        # Execute search
        results = self.es.search(index="posts", body=search_body)
        
        return {
            'posts': [hit['_source'] for hit in results['hits']['hits']],
            'total': results['hits']['total']['value']
        }
    
    def search_users(self, query, page=1, limit=20):
        """Search users"""
        search_body = {
            "query": {
                "bool": {
                    "should": [
                        {"match": {"username": {"query": query, "boost": 3}}},
                        {"match": {"full_name": {"query": query, "boost": 2}}},
                        {"match": {"bio": query}}
                    ]
                }
            },
            "sort": [{"followers_count": {"order": "desc"}}],
            "from": (page - 1) * limit,
            "size": limit
        }
        
        results = self.es.search(index="users", body=search_body)
        
        return {
            'users': [hit['_source'] for hit in results['hits']['hits']],
            'total': results['hits']['total']['value']
        }
    
    def search_hashtags(self, query, page=1, limit=20):
        """Search hashtags"""
        search_body = {
            "query": {
                "wildcard": {
                    "hashtag": f"*{query}*"
                }
            },
            "sort": [{"post_count": {"order": "desc"}}],
            "from": (page - 1) * limit,
            "size": limit
        }
        
        results = self.es.search(index="hashtags", body=search_body)
        
        return {
            'hashtags': [hit['_source'] for hit in results['hits']['hits']],
            'total': results['hits']['total']['value']
        }
```

### 🎯 **Recommendation Service**
```python
class RecommendationService:
    def __init__(self, ml_model, cache_client, db_connection):
        self.ml_model = ml_model
        self.cache = cache_client
        self.db = db_connection
    
    def get_recommended_posts(self, user_id, limit=20):
        """Get personalized post recommendations"""
        # Try cache first
        cache_key = f"recommendations:{user_id}"
        cached_recommendations = self.cache.get(cache_key)
        
        if cached_recommendations:
            post_ids = json.loads(cached_recommendations)
        else:
            # Get user features
            user_features = self.get_user_features(user_id)
            
            # Get candidate posts
            candidate_posts = self.get_candidate_posts(user_id)
            
            # Score posts using ML model
            scored_posts = self.ml_model.score_posts(user_features, candidate_posts)
            
            # Get top posts
            post_ids = [post['post_id'] for post in scored_posts[:limit]]
            
            # Cache recommendations
            self.cache.set(cache_key, json.dumps(post_ids), ttl=1800)  # 30 minutes
        
        # Get post details
        posts = self.db.session.query(Post).filter(
            Post.post_id.in_(post_ids),
            Post.is_public == True
        ).all()
        
        return posts
    
    def get_user_features(self, user_id):
        """Extract user features for recommendations"""
        # Get user's activity
        user_activity = self.get_user_activity(user_id)
        
        # Get user's interests
        user_interests = self.get_user_interests(user_id)
        
        # Get user's network
        user_network = self.get_user_network(user_id)
        
        return {
            'user_id': user_id,
            'activity': user_activity,
            'interests': user_interests,
            'network': user_network
        }
    
    def get_user_interests(self, user_id):
        """Get user's interests based on interactions"""
        # Get liked posts and their hashtags
        liked_posts = self.db.session.query(Post).join(PostLike).filter(
            PostLike.user_id == user_id
        ).all()
        
        hashtag_counts = {}
        for post in liked_posts:
            for hashtag in post.hashtags:
                hashtag_counts[hashtag] = hashtag_counts.get(hashtag, 0) + 1
        
        return hashtag_counts
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Feed Cache (Redis):
   - User feeds: TTL 5 minutes
   - Explore feeds: TTL 10 minutes
   - Story feeds: TTL 2 minutes

2. Content Cache (Redis):
   - Post details: TTL 1 hour
   - User profiles: TTL 30 minutes
   - Media URLs: TTL 24 hours

3. Social Cache (Redis):
   - Follow relationships: TTL 1 hour
   - Like status: TTL 30 minutes
   - Comment counts: TTL 5 minutes

4. CDN Cache:
   - Media files and thumbnails
   - Static assets
   - Geographic distribution
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary keys on post_id and user_id
- Composite indexes for feed queries
- Full-text search indexes for captions
- GIN indexes for hashtags and mentions

Partitioning:
- Partition posts by date
- Partition stories by date
- Use read replicas for analytics
```

## 🔒 **Security Considerations**

### 🛡️ **Content Moderation**
```python
class ContentModeration:
    def __init__(self, ml_classifier, rules_engine):
        self.ml_classifier = ml_classifier
        self.rules_engine = rules_engine
    
    def moderate_content(self, content, user_id):
        """Moderate user-generated content"""
        # Check for inappropriate content
        inappropriate_score = self.ml_classifier.classify_content(content)
        
        # Check for spam
        spam_score = self.rules_engine.check_spam(content, user_id)
        
        # Check for copyright violations
        copyright_check = self.check_copyright(content)
        
        if inappropriate_score > 0.8 or spam_score > 0.7:
            return {'approved': False, 'reason': 'Content violates guidelines'}
        
        if copyright_check['violation']:
            return {'approved': False, 'reason': 'Copyright violation detected'}
        
        return {'approved': True}
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless content service instances
- Feed service with read replicas
- Search service with Elasticsearch cluster
- Media processing with worker queues

Load Distribution:
- Geographic load balancing
- Content-based routing
- User-based sharding
- Media CDN distribution
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Daily active users
- Posts created per day
- Engagement rates
- Story completion rates
- Search query performance

Technical Metrics:
- Feed load times
- Media upload success rates
- Search response times
- Cache hit rates
- Database query performance
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Content creation and validation
- Feed generation algorithms
- Search functionality
- Recommendation models

Integration Testing:
- End-to-end post creation
- Feed loading and pagination
- Search and discovery
- Social interactions

Load Testing:
- High-volume content uploads
- Concurrent feed requests
- Search performance under load
- Media processing queues
```

---

**This Instagram system design provides a comprehensive, scalable platform for social media with advanced content discovery, real-time interactions, and personalized recommendations.** 