# 🎥 Video Platform System Design

> **Design a video platform like YouTube that can handle millions of video uploads, process various video formats, provide adaptive streaming, and offer personalized recommendations.**

## 📋 **Problem Statement**

Design a video platform that can:
- Handle millions of video uploads and streams daily
- Process and transcode videos into multiple formats and qualities
- Provide adaptive bitrate streaming for optimal viewing experience
- Support real-time video streaming and live broadcasts
- Generate personalized video recommendations
- Enable social features (comments, likes, subscriptions)
- Handle video search and discovery
- Support multiple devices and bandwidth conditions
- Provide analytics and monetization features
- Ensure content moderation and copyright protection

## 🎯 **Requirements**

### ✅ **Functional Requirements**
- **Video Upload**: Support multiple formats, chunked uploads, and resume capability
- **Video Processing**: Transcoding, thumbnail generation, and metadata extraction
- **Video Streaming**: Adaptive bitrate streaming (HLS/DASH)
- **Live Streaming**: Real-time video broadcasting with low latency
- **Video Discovery**: Search, recommendations, and trending algorithms
- **Social Features**: Comments, likes, dislikes, subscriptions, and sharing
- **User Management**: User profiles, channels, and content management
- **Analytics**: View counts, engagement metrics, and performance tracking
- **Monetization**: Ads, subscriptions, and creator revenue sharing
- **Content Moderation**: Automated and manual content review

### 📊 **Non-Functional Requirements**
- **Scale**: Handle 100M+ daily active users and 1B+ video views per day
- **Performance**: < 2s video start time, < 100ms search response
- **Availability**: 99.99% uptime for video streaming
- **Quality**: Support up to 4K video quality with adaptive streaming
- **Global**: Multi-region CDN for global content delivery
- **Security**: Content protection and copyright enforcement

## 📈 **Scale Estimation**

### 🚀 **Traffic Estimation**
```
Daily Active Users: 100M+
Daily Video Views: 1B+
Daily Video Uploads: 10M+
Peak Concurrent Streams: 50M+
Storage for Videos: 1B * 100MB = 100PB
Storage for Thumbnails: 1B * 50KB = 50TB
Daily Bandwidth: 1B * 5MB = 5PB
Processing Power: 10M * 10 minutes = 1.7M hours/day
```

## 🏗️ **High-Level Architecture**

### 📊 **System Components**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Mobile App    │    │   Smart TV      │
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
│  Upload Service   │  │  Streaming Service│  │  Search Service   │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Processing       │  │  CDN Edge         │  │  Recommendation   │
│  Pipeline         │  │  Servers          │  │  Engine           │
└─────────┬─────────┘  └─────────┬─────────┘  └─────────┬─────────┘
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│  Transcoding      │  │  Live Streaming   │  │  Analytics        │
│  Service          │  │  Service          │  │  Service          │
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

### 🎬 **Videos Table (PostgreSQL)**
```sql
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,
    video_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL REFERENCES users(id),
    channel_id BIGINT REFERENCES channels(id),
    category_id INTEGER REFERENCES categories(id),
    duration INTEGER NOT NULL, -- seconds
    file_size BIGINT NOT NULL, -- bytes
    resolution VARCHAR(20), -- '480p', '720p', '1080p', '4K'
    aspect_ratio VARCHAR(10), -- '16:9', '4:3', etc.
    language VARCHAR(10),
    is_public BOOLEAN DEFAULT TRUE,
    is_live BOOLEAN DEFAULT FALSE,
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(20) DEFAULT 'pending',
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    dislike_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_channel_id (channel_id),
    INDEX idx_category_id (category_id),
    INDEX idx_upload_date (upload_date),
    INDEX idx_view_count (view_count),
    INDEX idx_is_public (is_public),
    INDEX idx_is_processed (is_processed)
);

CREATE TABLE video_files (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    quality VARCHAR(20) NOT NULL, -- '144p', '240p', '360p', '480p', '720p', '1080p', '4K'
    format VARCHAR(10) NOT NULL, -- 'mp4', 'webm', 'hls'
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    bitrate INTEGER, -- kbps
    resolution_width INTEGER,
    resolution_height INTEGER,
    duration INTEGER,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_quality (quality),
    INDEX idx_format (format),
    INDEX idx_is_processed (is_processed)
);

CREATE TABLE video_thumbnails (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    thumbnail_type VARCHAR(20) NOT NULL, -- 'default', 'custom', 'auto-generated'
    file_path VARCHAR(500) NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    file_size INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_thumbnail_type (thumbnail_type),
    INDEX idx_is_primary (is_primary)
);

CREATE TABLE video_metadata (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    metadata_type VARCHAR(50) NOT NULL, -- 'exif', 'ffprobe', 'custom'
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_metadata_type (metadata_type),
    INDEX idx_metadata_key (metadata_key)
);
```

### 👥 **Users and Social Tables (PostgreSQL)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    country VARCHAR(10),
    language VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    is_creator BOOLEAN DEFAULT FALSE,
    subscriber_count INTEGER DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_creator (is_creator),
    INDEX idx_subscriber_count (subscriber_count)
);

CREATE TABLE channels (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    channel_name VARCHAR(100) NOT NULL,
    channel_description TEXT,
    channel_avatar VARCHAR(500),
    channel_banner VARCHAR(500),
    subscriber_count INTEGER DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_channel_name (channel_name),
    INDEX idx_subscriber_count (subscriber_count)
);

CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    subscriber_id BIGINT NOT NULL REFERENCES users(id),
    channel_id BIGINT NOT NULL REFERENCES channels(id),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subscriber_id, channel_id),
    INDEX idx_subscriber_id (subscriber_id),
    INDEX idx_channel_id (channel_id)
);

CREATE TABLE video_likes (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    like_type VARCHAR(10) NOT NULL, -- 'like', 'dislike'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id, user_id),
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_like_type (like_type)
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    parent_comment_id BIGINT REFERENCES comments(id),
    comment_text TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_comment_id (parent_comment_id),
    INDEX idx_created_at (created_at)
);
```

### 📊 **Analytics Tables (PostgreSQL)**
```sql
CREATE TABLE video_views (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    user_id BIGINT REFERENCES users(id),
    session_id VARCHAR(100),
    view_duration INTEGER, -- seconds
    watch_percentage DECIMAL(5,2), -- percentage of video watched
    device_type VARCHAR(20), -- 'mobile', 'desktop', 'tv', 'tablet'
    platform VARCHAR(20), -- 'web', 'ios', 'android', 'smart_tv'
    country VARCHAR(10),
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viewed_at (viewed_at),
    INDEX idx_country (country),
    INDEX idx_device_type (device_type)
);

CREATE TABLE video_shares (
    id BIGSERIAL PRIMARY KEY,
    video_id BIGINT NOT NULL REFERENCES videos(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    share_platform VARCHAR(50), -- 'facebook', 'twitter', 'whatsapp', 'email'
    share_url VARCHAR(500),
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_user_id (user_id),
    INDEX idx_share_platform (share_platform),
    INDEX idx_shared_at (shared_at)
);

CREATE TABLE search_queries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    query_text TEXT NOT NULL,
    result_count INTEGER,
    clicked_video_id BIGINT REFERENCES videos(id),
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_query_text (query_text),
    INDEX idx_search_date (search_date)
);
```

## 🔧 **Detailed Component Design**

### 📤 **Upload Service**
```python
class UploadService:
    def __init__(self, storage_client, queue_client, db_connection, 
                 processing_service, event_stream):
        self.storage = storage_client
        self.queue = queue_client
        self.db = db_connection
        self.processing = processing_service
        self.event_stream = event_stream
    
    def initiate_upload(self, user_id, video_metadata):
        """Initiate video upload process"""
        # Generate unique video ID
        video_id = self.generate_video_id()
        
        # Create video record
        video = Video(
            video_id=video_id,
            title=video_metadata.get('title', 'Untitled'),
            description=video_metadata.get('description', ''),
            user_id=user_id,
            duration=video_metadata.get('duration', 0),
            file_size=video_metadata.get('file_size', 0),
            resolution=video_metadata.get('resolution', ''),
            language=video_metadata.get('language', 'en')
        )
        
        self.db.session.add(video)
        self.db.session.commit()
        
        # Generate upload URLs for chunks
        upload_urls = self.generate_upload_urls(video_id, video_metadata['file_size'])
        
        return {
            'video_id': video_id,
            'upload_urls': upload_urls,
            'chunk_size': self.CHUNK_SIZE
        }
    
    def handle_chunk_upload(self, video_id, chunk_index, chunk_data):
        """Handle individual chunk upload"""
        # Store chunk in temporary storage
        chunk_key = f"uploads/{video_id}/chunk_{chunk_index}"
        self.storage.upload_chunk(chunk_key, chunk_data)
        
        # Update upload progress
        self.update_upload_progress(video_id, chunk_index)
        
        return {'status': 'success', 'chunk_index': chunk_index}
    
    def complete_upload(self, video_id):
        """Complete upload and start processing"""
        # Combine all chunks
        video_file = self.combine_chunks(video_id)
        
        # Store final video file
        final_path = f"videos/{video_id}/original.mp4"
        self.storage.move_file(video_file, final_path)
        
        # Update video status
        video = self.db.session.query(Video).filter_by(video_id=video_id).first()
        video.processing_status = 'pending'
        video.is_processed = False
        self.db.session.commit()
        
        # Queue for processing
        self.queue.add_processing_job(video_id, 'transcode')
        
        # Publish event
        self.event_stream.publish('video_uploaded', {
            'video_id': video_id,
            'user_id': video.user_id,
            'file_size': video.file_size,
            'timestamp': datetime.now().isoformat()
        })
        
        return {'status': 'success', 'video_id': video_id}
    
    def generate_upload_urls(self, video_id, file_size):
        """Generate pre-signed URLs for chunk uploads"""
        chunk_size = self.CHUNK_SIZE
        num_chunks = (file_size + chunk_size - 1) // chunk_size
        
        upload_urls = []
        for i in range(num_chunks):
            chunk_key = f"uploads/{video_id}/chunk_{i}"
            url = self.storage.generate_presigned_url(
                chunk_key, 
                method='PUT',
                expires_in=3600  # 1 hour
            )
            upload_urls.append({
                'chunk_index': i,
                'url': url,
                'start_byte': i * chunk_size,
                'end_byte': min((i + 1) * chunk_size - 1, file_size - 1)
            })
        
        return upload_urls
    
    def combine_chunks(self, video_id):
        """Combine uploaded chunks into final video file"""
        chunks = []
        chunk_index = 0
        
        while True:
            chunk_key = f"uploads/{video_id}/chunk_{chunk_index}"
            chunk_data = self.storage.get_chunk(chunk_key)
            
            if not chunk_data:
                break
            
            chunks.append(chunk_data)
            chunk_index += 1
        
        # Combine chunks
        combined_file = b''.join(chunks)
        
        # Store combined file temporarily
        temp_path = f"temp/{video_id}/combined.mp4"
        self.storage.upload_file(temp_path, combined_file)
        
        return temp_path
```

### 🎬 **Video Processing Service**
```python
class VideoProcessingService:
    def __init__(self, storage_client, transcoding_service, thumbnail_service, 
                 db_connection, event_stream):
        self.storage = storage_client
        self.transcoding = transcoding_service
        self.thumbnails = thumbnail_service
        self.db = db_connection
        self.event_stream = event_stream
    
    def process_video(self, video_id):
        """Process uploaded video"""
        try:
            # Update status
            self.update_processing_status(video_id, 'processing')
            
            # Get video file
            video_path = f"videos/{video_id}/original.mp4"
            video_file = self.storage.download_file(video_path)
            
            # Extract metadata
            metadata = self.extract_video_metadata(video_file)
            
            # Generate thumbnails
            thumbnail_paths = self.thumbnails.generate_thumbnails(video_file, video_id)
            
            # Transcode to multiple qualities
            transcoded_paths = self.transcoding.transcode_video(video_file, video_id)
            
            # Update database
            self.update_video_files(video_id, transcoded_paths)
            self.update_video_thumbnails(video_id, thumbnail_paths)
            self.update_video_metadata(video_id, metadata)
            
            # Mark as processed
            self.update_processing_status(video_id, 'completed')
            
            # Publish event
            self.event_stream.publish('video_processed', {
                'video_id': video_id,
                'qualities': list(transcoded_paths.keys()),
                'thumbnail_count': len(thumbnail_paths),
                'timestamp': datetime.now().isoformat()
            })
            
            return {'status': 'success', 'video_id': video_id}
            
        except Exception as e:
            self.update_processing_status(video_id, 'failed')
            raise e
    
    def extract_video_metadata(self, video_file):
        """Extract metadata from video file"""
        import ffmpeg
        
        probe = ffmpeg.probe(video_file)
        video_stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
        audio_stream = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
        
        metadata = {
            'duration': float(probe['format']['duration']),
            'file_size': int(probe['format']['size']),
            'bitrate': int(probe['format']['bit_rate']),
            'video_codec': video_stream['codec_name'],
            'video_width': int(video_stream['width']),
            'video_height': int(video_stream['height']),
            'video_fps': eval(video_stream['r_frame_rate']),
            'audio_codec': audio_stream['codec_name'] if audio_stream else None,
            'audio_channels': int(audio_stream['channels']) if audio_stream else 0,
            'audio_sample_rate': int(audio_stream['sample_rate']) if audio_stream else 0
        }
        
        return metadata
    
    def update_video_files(self, video_id, transcoded_paths):
        """Update video files in database"""
        for quality, file_path in transcoded_paths.items():
            file_size = self.storage.get_file_size(file_path)
            
            video_file = VideoFile(
                video_id=video_id,
                quality=quality,
                format='mp4',
                file_path=file_path,
                file_size=file_size,
                is_processed=True
            )
            
            self.db.session.add(video_file)
        
        self.db.session.commit()
    
    def update_video_thumbnails(self, video_id, thumbnail_paths):
        """Update video thumbnails in database"""
        for i, thumbnail_path in enumerate(thumbnail_paths):
            is_primary = (i == 0)  # First thumbnail is primary
            
            thumbnail = VideoThumbnail(
                video_id=video_id,
                thumbnail_type='auto-generated',
                file_path=thumbnail_path,
                width=320,
                height=180,
                is_primary=is_primary
            )
            
            self.db.session.add(thumbnail)
        
        self.db.session.commit()
```

### 📺 **Streaming Service**
```python
class StreamingService:
    def __init__(self, storage_client, cdn_client, db_connection, 
                 analytics_service, cache_client):
        self.storage = storage_client
        self.cdn = cdn_client
        self.db = db_connection
        self.analytics = analytics_service
        self.cache = cache_client
    
    def get_video_stream(self, video_id, quality=None, user_id=None):
        """Get video stream URL"""
        # Check cache first
        cache_key = f"stream:{video_id}:{quality}"
        cached_url = self.cache.get(cache_key)
        
        if cached_url:
            return json.loads(cached_url)
        
        # Get video info
        video = self.db.session.query(Video).filter_by(video_id=video_id).first()
        if not video or not video.is_public:
            raise VideoNotFoundError(f"Video {video_id} not found or not public")
        
        # Get available qualities
        video_files = self.db.session.query(VideoFile).filter_by(
            video_id=video.id, is_processed=True
        ).all()
        
        if not video_files:
            raise VideoNotProcessedError(f"Video {video_id} not yet processed")
        
        # Select quality
        if not quality:
            quality = self.select_optimal_quality(video_files)
        
        # Get stream URL
        stream_url = self.generate_stream_url(video_id, quality)
        
        # Cache URL
        self.cache.setex(cache_key, 3600, json.dumps(stream_url))  # 1 hour TTL
        
        # Track view
        if user_id:
            self.analytics.track_video_view(video_id, user_id)
        
        return stream_url
    
    def select_optimal_quality(self, video_files):
        """Select optimal quality based on available options"""
        # Sort by quality (assuming quality names contain resolution numbers)
        sorted_files = sorted(video_files, key=lambda f: self.parse_quality(f.quality))
        
        # Return middle quality for balance
        return sorted_files[len(sorted_files) // 2].quality
    
    def parse_quality(self, quality):
        """Parse quality string to numeric value"""
        # Extract resolution number from quality string
        import re
        match = re.search(r'(\d+)p', quality)
        return int(match.group(1)) if match else 0
    
    def generate_stream_url(self, video_id, quality):
        """Generate streaming URL for video"""
        # For HLS streaming
        if quality == 'hls':
            return {
                'type': 'hls',
                'url': f"{self.cdn.base_url}/videos/{video_id}/hls/master.m3u8",
                'qualities': self.get_hls_qualities(video_id)
            }
        
        # For direct MP4 streaming
        return {
            'type': 'mp4',
            'url': f"{self.cdn.base_url}/videos/{video_id}/{quality}.mp4",
            'quality': quality
        }
    
    def get_hls_qualities(self, video_id):
        """Get available HLS qualities"""
        video_files = self.db.session.query(VideoFile).filter_by(
            video_id=video_id, format='hls', is_processed=True
        ).all()
        
        return [f.quality for f in video_files]
    
    def create_live_stream(self, user_id, stream_title, stream_description=None):
        """Create live streaming session"""
        # Generate stream ID
        stream_id = self.generate_stream_id()
        
        # Create video record for live stream
        video = Video(
            video_id=stream_id,
            title=stream_title,
            description=stream_description or '',
            user_id=user_id,
            is_live=True,
            is_public=True,
            processing_status='live'
        )
        
        self.db.session.add(video)
        self.db.session.commit()
        
        # Generate streaming URLs
        stream_urls = {
            'rtmp_url': f"rtmp://live.example.com/live/{stream_id}",
            'hls_url': f"https://cdn.example.com/live/{stream_id}/master.m3u8",
            'stream_key': self.generate_stream_key(stream_id)
        }
        
        return {
            'stream_id': stream_id,
            'stream_urls': stream_urls
        }
```

### 🔍 **Recommendation Engine**
```python
class RecommendationEngine:
    def __init__(self, ml_model, db_connection, cache_client, analytics_service):
        self.ml_model = ml_model
        self.db = db_connection
        self.cache = cache_client
        self.analytics = analytics_service
    
    def get_recommendations(self, user_id=None, video_id=None, limit=20):
        """Get video recommendations"""
        if user_id:
            return self.get_personalized_recommendations(user_id, limit)
        elif video_id:
            return self.get_related_videos(video_id, limit)
        else:
            return self.get_trending_videos(limit)
    
    def get_personalized_recommendations(self, user_id, limit=20):
        """Get personalized recommendations based on user history"""
        # Try cache first
        cache_key = f"recommendations:{user_id}"
        cached_recommendations = self.cache.get(cache_key)
        
        if cached_recommendations:
            return json.loads(cached_recommendations)
        
        # Get user's viewing history
        user_history = self.analytics.get_user_view_history(user_id, limit=100)
        
        if not user_history:
            # Fallback to trending videos
            return self.get_trending_videos(limit)
        
        # Extract user preferences
        user_preferences = self.extract_user_preferences(user_history)
        
        # Get recommendations from ML model
        recommended_video_ids = self.ml_model.get_recommendations(
            user_id, user_preferences, limit
        )
        
        # Get video details
        videos = self.get_videos_by_ids(recommended_video_ids)
        
        # Cache recommendations
        self.cache.setex(cache_key, 1800, json.dumps(videos))  # 30 min TTL
        
        return videos
    
    def get_related_videos(self, video_id, limit=20):
        """Get related videos based on current video"""
        # Get current video
        video = self.db.session.query(Video).filter_by(video_id=video_id).first()
        if not video:
            return []
        
        # Find related videos based on:
        # 1. Same category
        # 2. Same channel
        # 3. Similar tags
        # 4. Viewing patterns
        
        related_videos = []
        
        # Same category videos
        category_videos = self.db.session.query(Video).filter(
            Video.category_id == video.category_id,
            Video.id != video.id,
            Video.is_public == True
        ).order_by(Video.view_count.desc()).limit(limit // 2).all()
        
        related_videos.extend(category_videos)
        
        # Same channel videos
        if video.channel_id:
            channel_videos = self.db.session.query(Video).filter(
                Video.channel_id == video.channel_id,
                Video.id != video.id,
                Video.is_public == True
            ).order_by(Video.upload_date.desc()).limit(limit // 4).all()
            
            related_videos.extend(channel_videos)
        
        # Remove duplicates and limit
        unique_videos = list({v.id: v for v in related_videos}.values())
        return unique_videos[:limit]
    
    def get_trending_videos(self, limit=20):
        """Get trending videos based on recent activity"""
        # Try cache first
        cache_key = "trending_videos"
        cached_trending = self.cache.get(cache_key)
        
        if cached_trending:
            return json.loads(cached_trending)
        
        # Calculate trending score based on:
        # - Recent views
        # - Like/dislike ratio
        # - Comment activity
        # - Share activity
        
        trending_videos = self.db.session.query(Video).filter(
            Video.is_public == True,
            Video.upload_date >= datetime.now() - timedelta(days=7)
        ).order_by(
            (Video.view_count * 0.4 + 
             Video.like_count * 0.3 + 
             Video.comment_count * 0.2 + 
             Video.share_count * 0.1).desc()
        ).limit(limit).all()
        
        # Cache trending videos
        self.cache.setex(cache_key, 900, json.dumps(trending_videos))  # 15 min TTL
        
        return trending_videos
    
    def extract_user_preferences(self, user_history):
        """Extract user preferences from viewing history"""
        preferences = {
            'categories': {},
            'channels': {},
            'tags': {},
            'watch_duration': 0,
            'total_videos': len(user_history)
        }
        
        for view in user_history:
            video = view.video
            
            # Category preference
            if video.category_id:
                preferences['categories'][video.category_id] = \
                    preferences['categories'].get(video.category_id, 0) + 1
            
            # Channel preference
            if video.channel_id:
                preferences['channels'][video.channel_id] = \
                    preferences['channels'].get(video.channel_id, 0) + 1
            
            # Watch duration
            preferences['watch_duration'] += view.view_duration or 0
        
        return preferences
```

## ⚡ **Performance Optimization**

### 🗄️ **Caching Strategy**
```
Cache Layers:
1. Video Stream Cache (Redis):
   - Stream URLs: TTL 1 hour
   - Video metadata: TTL 6 hours
   - Thumbnail URLs: TTL 24 hours

2. Recommendation Cache (Redis):
   - User recommendations: TTL 30 minutes
   - Trending videos: TTL 15 minutes
   - Related videos: TTL 1 hour

3. CDN Cache:
   - Video segments: TTL 1 hour
   - Thumbnails: TTL 24 hours
   - Static assets: TTL 1 week

4. Database Cache:
   - Video metadata: TTL 1 hour
   - User preferences: TTL 30 minutes
   - Analytics data: TTL 5 minutes
```

### 📊 **Database Optimization**
```
Indexing Strategy:
- Primary keys on video_id and user_id
- Composite indexes for search queries
- Full-text search on video titles and descriptions
- Partitioning by upload date for videos

Sharding Strategy:
- Shard videos by user_id
- Shard analytics by date
- Use read replicas for search and recommendations
```

## 🔒 **Security Considerations**

### 🛡️ **Content Moderation**
```python
class ContentModerationService:
    def __init__(self, ml_classifier, rules_engine, human_review_queue):
        self.ml_classifier = ml_classifier
        self.rules_engine = rules_engine
        self.review_queue = human_review_queue
    
    def moderate_video(self, video_file, video_metadata):
        """Moderate uploaded video content"""
        # Video content analysis
        video_score = self.ml_classifier.analyze_video(video_file)
        
        # Thumbnail analysis
        thumbnail_score = self.ml_classifier.analyze_thumbnails(video_metadata.get('thumbnails', []))
        
        # Text content analysis
        text_score = self.analyze_text_content(video_metadata)
        
        # Rule-based checks
        rule_violations = self.rules_engine.check_video_rules(video_metadata)
        
        # Combine scores
        overall_score = max(video_score, thumbnail_score, text_score)
        
        moderation_result = {
            'is_approved': overall_score < 0.7 and not rule_violations,
            'confidence_score': overall_score,
            'violations': rule_violations,
            'requires_review': 0.5 <= overall_score < 0.7
        }
        
        # Queue for human review if needed
        if moderation_result['requires_review']:
            self.review_queue.add_video_for_review(video_metadata['video_id'])
        
        return moderation_result
    
    def analyze_text_content(self, video_metadata):
        """Analyze text content for inappropriate material"""
        text_content = [
            video_metadata.get('title', ''),
            video_metadata.get('description', ''),
            video_metadata.get('tags', [])
        ]
        
        combined_text = ' '.join(text_content)
        return self.ml_classifier.analyze_text(combined_text)
```

## 📈 **Scalability Strategies**

### 🔄 **Horizontal Scaling**
```
Service Scaling:
- Stateless streaming service instances
- Processing workers with distributed queues
- Recommendation engine with ML model serving
- CDN edge servers for global distribution

Load Distribution:
- Geographic load balancing
- Quality-based routing
- Device-specific optimization
- Regional content prioritization
```

## 🚨 **Monitoring & Alerting**

### 📊 **Key Metrics**
```
Business Metrics:
- Daily active users
- Video views per day
- Upload success rate
- User engagement (likes, comments, shares)
- Revenue per user

Technical Metrics:
- Video processing time
- Streaming quality metrics
- CDN performance
- Upload success rates
- Recommendation accuracy
```

## 🧪 **Testing Strategy**

### 🔬 **Testing Approaches**
```
Unit Testing:
- Video processing algorithms
- Recommendation algorithms
- Upload chunk handling
- Stream URL generation

Integration Testing:
- End-to-end video upload flow
- Streaming pipeline
- Processing queue
- Analytics tracking

Load Testing:
- High-concurrency video uploads
- Streaming performance under load
- Processing queue capacity
- CDN performance
```

---

**This video platform system design provides a comprehensive, scalable platform for video hosting, processing, streaming, and discovery with advanced features for content creators and viewers.** 