# 🎥 Video Streaming System Design

> **Design a scalable video streaming platform like Netflix or YouTube that can handle millions of concurrent viewers with adaptive bitrate streaming and global CDN distribution.**

## 📋 **Problem Statement**

Design a video streaming platform that can:
- Stream videos to millions of concurrent users
- Support adaptive bitrate streaming (HLS/DASH)
- Handle video upload, processing, and encoding
- Provide global content delivery via CDN
- Support live streaming and VOD content
- Handle video recommendations and search
- Manage user subscriptions and billing
- Provide analytics and viewer insights

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Video Upload**: Support multiple formats and large file uploads
- **Video Processing**: Transcoding, encoding, thumbnail generation
- **Adaptive Streaming**: HLS/DASH with multiple quality levels
- **Content Delivery**: Global CDN with edge caching
- **Live Streaming**: Real-time video broadcasting
- **Video Search**: Content discovery and recommendations
- **User Management**: Profiles, subscriptions, watch history
- **Analytics**: Viewer metrics, engagement tracking

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 10M+ concurrent viewers
- **Performance**: < 2s video start time
- **Availability**: 99.9% uptime
- **Quality**: Support up to 4K resolution
- **Global**: Sub-100ms latency worldwide
- **Bandwidth**: Optimize for various network conditions

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users (DAU): 100M
Concurrent viewers: 10M
Videos watched per user per day: 5
Total video views per day: 500M
Average video length: 10 minutes
Total streaming hours per day: 83M hours
Storage for videos: 500M * 100MB = 50PB
CDN bandwidth: 10M * 5Mbps = 50Tbps peak
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   Smart TV App   │
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
│  Video Service    │  │  Streaming Service│  │  User Service     │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Video Processing        │
                    │   (Transcoding, Encoding) │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Content Delivery        │
                    │   Network (CDN)           │
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

### 📊 **Videos Table (PostgreSQL)**
```sql
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    video_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL REFERENCES users(id),
    duration INTEGER NOT NULL, -- in seconds
    file_size BIGINT NOT NULL, -- in bytes
    resolution VARCHAR(20), -- '480p', '720p', '1080p', '4K'
    status VARCHAR(20) DEFAULT 'processing', -- 'processing', 'ready', 'failed'
    thumbnail_url VARCHAR(500),
    video_urls JSONB, -- different quality URLs
    metadata JSONB,
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    is_live BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_view_count (view_count)
);

CREATE TABLE video_qualities (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    quality VARCHAR(20) NOT NULL, -- '240p', '360p', '480p', '720p', '1080p', '4K'
    bitrate INTEGER NOT NULL, -- in kbps
    file_size BIGINT NOT NULL, -- in bytes
    cdn_url VARCHAR(500) NOT NULL,
    hls_playlist_url VARCHAR(500),
    dash_manifest_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id, quality)
);

CREATE TABLE user_watch_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    video_id BIGINT NOT NULL REFERENCES videos(id),
    watch_duration INTEGER NOT NULL, -- in seconds
    progress_percentage DECIMAL(5,2), -- 0-100
    quality_watched VARCHAR(20),
    device_type VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_watched_at (watched_at)
);
```

## 🔧 **Detailed Component Design**

### 🎥 **Video Service**
```python
class VideoService:
    def __init__(self, storage_client, processing_client, cache_client, event_stream):
        self.storage = storage_client
        self.processing = processing_client
        self.cache = cache_client
        self.event_stream = event_stream
    
    def upload_video(self, user_id, file_data, metadata):
        """Upload and process video"""
        # Generate video ID
        video_id = self.generate_video_id()
        
        # Create video record
        video = Video(
            video_id=video_id,
            title=metadata.get('title', 'Untitled'),
            description=metadata.get('description', ''),
            user_id=user_id,
            duration=metadata.get('duration', 0),
            file_size=len(file_data),
            resolution=metadata.get('resolution', '720p'),
            status='processing'
        )
        
        self.db.session.add(video)
        self.db.session.commit()
        
        # Upload to storage
        storage_url = self.storage.upload_file(file_data, f"videos/{video_id}/original")
        
        # Trigger processing
        processing_job = self.processing.create_job({
            'video_id': video_id,
            'input_url': storage_url,
            'output_formats': ['hls', 'dash'],
            'qualities': ['240p', '360p', '480p', '720p', '1080p'],
            'generate_thumbnail': True
        })
        
        # Publish event
        self.event_stream.publish('video_uploaded', {
            'video_id': video_id,
            'user_id': user_id,
            'processing_job_id': processing_job['id'],
            'timestamp': datetime.now().isoformat()
        })
        
        return video
    
    def get_video(self, video_id, user_id=None):
        """Get video details and streaming URLs"""
        # Try cache first
        cache_key = f"video:{video_id}"
        cached_video = self.cache.get(cache_key)
        if cached_video:
            video_data = json.loads(cached_video)
        else:
            # Get from database
            video = self.db.session.query(Video).filter(Video.video_id == video_id).first()
            if not video:
                raise ValueError('Video not found')
            
            video_data = {
                'id': video.video_id,
                'title': video.title,
                'description': video.description,
                'duration': video.duration,
                'view_count': video.view_count,
                'like_count': video.like_count,
                'thumbnail_url': video.thumbnail_url,
                'qualities': self.get_video_qualities(video.id)
            }
            
            # Cache for 1 hour
            self.cache.set(cache_key, json.dumps(video_data), ttl=3600)
        
        # Track view if user is authenticated
        if user_id:
            self.track_view(user_id, video_id)
        
        return video_data
    
    def get_video_qualities(self, video_id):
        """Get available video qualities and URLs"""
        qualities = self.db.session.query(VideoQuality).filter(
            VideoQuality.video_id == video_id
        ).all()
        
        return {
            quality.quality: {
                'bitrate': quality.bitrate,
                'cdn_url': quality.cdn_url,
                'hls_url': quality.hls_playlist_url,
                'dash_url': quality.dash_manifest_url
            }
            for quality in qualities
        }
```

### 📺 **Streaming Service**
```python
class StreamingService:
    def __init__(self, cdn_client, cache_client, analytics_client):
        self.cdn = cdn_client
        self.cache = cache_client
        self.analytics = analytics_client
    
    def get_streaming_urls(self, video_id, user_location=None):
        """Get optimized streaming URLs for user"""
        # Get video qualities
        qualities = self.get_video_qualities(video_id)
        
        # Select best CDN edge based on user location
        cdn_edge = self.select_cdn_edge(user_location)
        
        # Generate streaming URLs
        streaming_urls = {}
        for quality, quality_data in qualities.items():
            streaming_urls[quality] = {
                'hls': self.cdn.get_url(quality_data['hls_url'], cdn_edge),
                'dash': self.cdn.get_url(quality_data['dash_url'], cdn_edge),
                'direct': self.cdn.get_url(quality_data['cdn_url'], cdn_edge),
                'bitrate': quality_data['bitrate']
            }
        
        return streaming_urls
    
    def select_cdn_edge(self, user_location):
        """Select optimal CDN edge server"""
        if not user_location:
            return 'default'
        
        # Use geolocation to find nearest edge
        edge_servers = {
            'us-east': ['new-york', 'atlanta', 'miami'],
            'us-west': ['los-angeles', 'seattle', 'san-francisco'],
            'europe': ['london', 'frankfurt', 'paris'],
            'asia': ['tokyo', 'singapore', 'mumbai']
        }
        
        # Simple region mapping (in production, use proper geolocation)
        if user_location.get('country') in ['US', 'CA']:
            if user_location.get('region') in ['NY', 'NJ', 'PA']:
                return 'new-york'
            else:
                return 'los-angeles'
        elif user_location.get('country') in ['GB', 'DE', 'FR']:
            return 'london'
        elif user_location.get('country') in ['JP', 'KR']:
            return 'tokyo'
        else:
            return 'default'
    
    def track_streaming_metrics(self, video_id, user_id, metrics):
        """Track streaming performance metrics"""
        streaming_data = {
            'video_id': video_id,
            'user_id': user_id,
            'start_time': metrics.get('start_time'),
            'buffer_time': metrics.get('buffer_time'),
            'quality_changes': metrics.get('quality_changes'),
            'bitrate': metrics.get('current_bitrate'),
            'device_type': metrics.get('device_type'),
            'timestamp': datetime.now().isoformat()
        }
        
        # Send to analytics
        self.analytics.track('streaming_metrics', streaming_data)
```

### 🔄 **Video Processing Service**
```python
class VideoProcessingService:
    def __init__(self, ffmpeg_client, storage_client, cdn_client):
        self.ffmpeg = ffmpeg_client
        self.storage = storage_client
        self.cdn = cdn_client
    
    def process_video(self, job_data):
        """Process video for multiple qualities and formats"""
        video_id = job_data['video_id']
        input_url = job_data['input_url']
        
        # Create output directory
        output_dir = f"videos/{video_id}/processed"
        
        # Process each quality
        for quality in job_data['qualities']:
            self.process_quality(input_url, output_dir, quality)
        
        # Generate HLS playlist
        self.generate_hls_playlist(output_dir, job_data['qualities'])
        
        # Generate DASH manifest
        self.generate_dash_manifest(output_dir, job_data['qualities'])
        
        # Generate thumbnail
        if job_data.get('generate_thumbnail'):
            self.generate_thumbnail(input_url, f"{output_dir}/thumbnail.jpg")
        
        # Upload to CDN
        cdn_urls = self.upload_to_cdn(output_dir)
        
        # Update database
        self.update_video_qualities(video_id, cdn_urls)
        
        return {'status': 'completed', 'cdn_urls': cdn_urls}
    
    def process_quality(self, input_url, output_dir, quality):
        """Process video for specific quality"""
        quality_settings = {
            '240p': {'width': 426, 'height': 240, 'bitrate': '400k'},
            '360p': {'width': 640, 'height': 360, 'bitrate': '800k'},
            '480p': {'width': 854, 'height': 480, 'bitrate': '1200k'},
            '720p': {'width': 1280, 'height': 720, 'bitrate': '2500k'},
            '1080p': {'width': 1920, 'height': 1080, 'bitrate': '5000k'}
        }
        
        settings = quality_settings[quality]
        
        # FFmpeg command for HLS
        hls_command = [
            'ffmpeg', '-i', input_url,
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-b:v', settings['bitrate'],
            '-maxrate', settings['bitrate'],
            '-bufsize', str(int(settings['bitrate']) * 2),
            '-vf', f'scale={settings["width"]}:{settings["height"]}',
            '-hls_time', '6',
            '-hls_list_size', '0',
            '-hls_segment_filename', f'{output_dir}/{quality}_%03d.ts',
            f'{output_dir}/{quality}.m3u8'
        ]
        
        self.ffmpeg.execute(hls_command)
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Video Metadata Cache (Redis):
   - Video details: TTL 1 hour
   - Streaming URLs: TTL 30 minutes
   - User preferences: TTL 1 hour

2. CDN Cache:
   - Video segments: TTL 24 hours
   - Thumbnails: TTL 1 week
   - Playlists: TTL 1 hour

3. Edge Cache:
   - Popular videos: TTL 1 hour
   - User recommendations: TTL 30 minutes
   - Search results: TTL 15 minutes
```

### 📊 **CDN Optimization**
```
CDN Strategy:
1. Geographic Distribution:
   - Edge servers in major cities
   - Automatic failover between edges
   - Load balancing based on latency

2. Content Optimization:
   - Video compression and encoding
   - Adaptive bitrate streaming
   - Prefetching for popular content

3. Caching Policies:
   - Hot content: Longer cache duration
   - Cold content: Shorter cache duration
   - Dynamic content: No caching
```

## 🔒 **Security Considerations**

### 🛡️ **Content Protection**
```python
class ContentProtection:
    def __init__(self, encryption_service, drm_service):
        self.encryption = encryption_service
        self.drm = drm_service
    
    def protect_video(self, video_id, content_key):
        """Apply DRM protection to video"""
        # Generate content key
        if not content_key:
            content_key = self.encryption.generate_key()
        
        # Encrypt video segments
        encrypted_segments = self.encryption.encrypt_video(video_id, content_key)
        
        # Generate DRM license
        license_data = self.drm.generate_license(content_key, video_id)
        
        return {
            'encrypted_segments': encrypted_segments,
            'license_url': license_data['url'],
            'content_key_id': content_key['id']
        }
    
    def validate_access(self, user_id, video_id):
        """Validate user access to video"""
        # Check subscription status
        subscription = self.get_user_subscription(user_id)
        
        # Check video restrictions
        video = self.get_video(video_id)
        
        # Check geographic restrictions
        user_location = self.get_user_location(user_id)
        
        return self.check_access_rights(subscription, video, user_location)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless video service instances
- Processing workers for video encoding
- CDN edge servers for global distribution
- Database read replicas for analytics

Load Distribution:
- Geographic load balancing
- Quality-based routing
- Device-specific optimization
- Peak time scaling
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Concurrent viewers
- Video completion rates
- User engagement time
- Popular content trends

Technical Metrics:
- Video start time
- Buffer ratio and quality switches
- CDN performance and cache hit rates
- Processing queue depth and time
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Video processing algorithms
- Streaming URL generation
- Quality selection logic
- DRM integration

Integration Testing:
- CDN integration
- Video upload and processing
- Streaming playback
- Analytics tracking

Load Testing:
- High-concurrency streaming
- Video processing under load
- CDN performance testing
- Database performance
```

---

**This video streaming system design provides a scalable, high-performance platform for delivering video content globally with adaptive streaming, comprehensive analytics, and robust content protection.** 