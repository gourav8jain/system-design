import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack, School, Code, TrendingUp } from '@mui/icons-material';

const ProblemDetail = () => {
  const { problemId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));



  // Mock data for different problems - in a real app, this would come from an API
  const problemData = {
    'url-shortener': {
      title: 'URL Shortener',
      icon: '🔗',
      description: 'Design a URL shortening service like bit.ly with analytics and custom domains.',
      difficulty: 'Basic',
      category: 'Web Services',
      scale: 'Medium',
      complexity: 'Low',
      requirements: {
        functional: [
          'URL Generation: Create short URLs from long URLs',
          'URL Redirection: Redirect short URLs to original URLs',
          'Analytics: Track click counts and user data',
          'Custom Domains: Support custom domain aliases',
          'Rate Limiting: Prevent abuse and spam',
        ],
        nonFunctional: [
          'Scale: Handle 100M+ URLs per day',
          'Performance: < 100ms redirect time',
          'Availability: 99.9% uptime',
          'Security: Prevent URL hijacking',
        ],
      },
      scaleEstimation: {
        users: '10M Daily Active Users',
        urls: '100M URLs per day',
        storage: '50GB URLs + 10GB analytics per day',
        requests: '1B redirects per day',
      },
      architecture: {
        components: [
          'Load Balancer',
          'URL Service',
          'Analytics Service',
          'Cache (Redis)',
          'Database (PostgreSQL)',
          'CDN',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │
└─────┬───────┘    └─────┬───────┘
      │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │    URL Service       │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │   Cache (Redis)      │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │ Database (PostgreSQL)│
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'urls',
            fields: ['id', 'short_code', 'original_url', 'user_id', 'created_at', 'expires_at'],
            indexes: ['short_code', 'user_id', 'created_at'],
          },
          {
            name: 'analytics',
            fields: ['id', 'short_code', 'ip_address', 'user_agent', 'referrer', 'clicked_at'],
            indexes: ['short_code', 'clicked_at'],
          },
        ],
      },
      optimization: {
        caching: [
          'URL mappings in Redis: TTL 1 hour',
          'Analytics data in cache: TTL 5 minutes',
        ],
        scaling: [
          'Horizontal scaling with load balancers',
          'Database read replicas',
          'CDN for static assets',
        ],
      },
      security: [
        'Rate limiting for URL creation',
        'URL validation and sanitization',
        'User authentication for premium features',
        'Malicious URL detection',
      ],
    },
    'rate-limiter': {
      title: 'Rate Limiter',
      icon: '⏱️',
      description: 'Implement distributed rate limiting with multiple algorithms and strategies.',
      difficulty: 'Basic',
      category: 'Infrastructure',
      scale: 'High',
      complexity: 'Medium',
      requirements: {
        functional: [
          'Rate Limiting: Limit requests per user/IP',
          'Multiple Algorithms: Token Bucket, Leaky Bucket, Fixed Window',
          'Distributed Support: Work across multiple servers',
          'Configuration: Adjustable limits and time windows',
          'Monitoring: Track rate limit violations',
        ],
        nonFunctional: [
          'Scale: Handle 1M+ requests per second',
          'Performance: < 10ms overhead per request',
          'Accuracy: Precise rate limiting',
          'Reliability: 99.99% uptime',
        ],
      },
      scaleEstimation: {
        requests: '1M requests per second',
        users: '100M unique users',
        storage: '10GB rate limit data',
        latency: '< 10ms overhead',
      },
      architecture: {
        components: [
          'Rate Limiter Service',
          'Redis Cluster',
          'Configuration Service',
          'Monitoring Service',
          'Load Balancer',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐
│ Application │    │ API Gateway │
└─────┬───────┘    └─────┬───────┘
      │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │ Rate Limiter Service │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │   Redis Cluster      │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'rate_limits',
            fields: ['id', 'user_id', 'algorithm', 'limit', 'window', 'current_count', 'reset_time'],
            indexes: ['user_id', 'reset_time'],
          },
        ],
      },
      optimization: {
        caching: [
          'Rate limit counters in Redis: TTL based on window',
          'User limits in memory cache: TTL 1 minute',
        ],
        scaling: [
          'Redis cluster for distributed rate limiting',
          'Horizontal scaling of rate limiter services',
        ],
      },
      security: [
        'Prevent rate limit bypass',
        'Secure configuration management',
        'Audit logging for violations',
      ],
    },
    'twitter-clone': {
      title: 'Twitter Clone',
      icon: '🐦',
      description: 'Design a social media platform like Twitter that can handle millions of users, tweets, and real-time interactions.',
      difficulty: 'Intermediate',
      category: 'Social Media',
      scale: 'Very High',
      complexity: 'High',
      requirements: {
        functional: [
          'Tweet Creation: Post tweets with text, media, hashtags',
          'User Following: Follow/unfollow other users',
          'Timeline Feeds: Home timeline and user profiles',
          'Interactions: Like, retweet, reply, bookmark',
          'Search: Search tweets, users, hashtags',
          'Direct Messages: Private messaging between users',
          'Notifications: Real-time notifications for interactions',
          'Trending Topics: Discover trending hashtags and topics',
        ],
        nonFunctional: [
          'Scale: Handle 500M+ users and 1B+ tweets per day',
          'Performance: < 200ms response time for timeline',
          'Availability: 99.9% uptime',
          'Real-time: Instant updates for interactions',
          'Search: Sub-second search response times',
        ],
      },
      scaleEstimation: {
        users: '500M Daily Active Users',
        tweets: '2.5B tweets per day',
        storage: '2.5TB tweets + 2.5PB media per day',
        requests: '50B timeline requests per day',
      },
      architecture: {
        components: [
          'Load Balancer',
          'API Gateway',
          'Tweet Service',
          'Timeline Service',
          'Search Service',
          'Event Stream (Kafka)',
          'Cache (Redis)',
          'Database Layer (PostgreSQL + MongoDB)',
        ],
        diagram: `
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
        `,
      },
      database: {
        tables: [
          {
            name: 'tweets',
            fields: ['id', 'user_id', 'content', 'media_urls', 'hashtags', 'mentions', 'created_at'],
            indexes: ['user_id', 'created_at', 'hashtags (GIN)', 'mentions (GIN)'],
          },
          {
            name: 'user_follows',
            fields: ['follower_id', 'following_id', 'created_at'],
            indexes: ['follower_id', 'following_id'],
          },
          {
            name: 'tweet_interactions',
            fields: ['tweet_id', 'user_id', 'interaction_type', 'created_at'],
            indexes: ['tweet_id', 'user_id', 'interaction_type'],
          },
        ],
      },
      optimization: {
        caching: [
          'Timeline Cache (Redis): TTL 5 minutes',
          'Search Cache (Redis): TTL 10 minutes',
          'CDN Cache: Media files and static assets',
        ],
        scaling: [
          'Horizontal scaling with load balancers',
          'Database read replicas for timeline queries',
          'Sharding tweets by user_id',
          'Cache clustering for high availability',
        ],
      },
      security: [
        'Content moderation and spam detection',
        'Rate limiting for API endpoints',
        'User authentication and authorization',
        'Data encryption in transit and at rest',
      ],
    },
    'chat-application': {
      title: 'Chat Application',
      icon: '💬',
      description: 'Design a real-time messaging application with encryption and group chat capabilities.',
      difficulty: 'Basic',
      category: 'Communication',
      scale: 'High',
      complexity: 'Medium',
      requirements: {
        functional: [
          'Real-time messaging between users',
          'Group chat functionality',
          'End-to-end encryption',
          'File and media sharing',
          'Message status (sent, delivered, read)',
          'User presence indicators',
          'Message search and history',
        ],
        nonFunctional: [
          'Scale: Handle 10M+ concurrent users',
          'Performance: < 100ms message delivery',
          'Security: End-to-end encryption',
          'Availability: 99.9% uptime',
          'Real-time: Instant message delivery',
        ],
      },
      scaleEstimation: {
        users: '10M Concurrent Users',
        messages: '100M messages per day',
        storage: '100GB messages + 1TB media per day',
        requests: '1M messages per second',
      },
      architecture: {
        components: [
          'WebSocket Gateway',
          'Message Service',
          'User Service',
          'Group Service',
          'Encryption Service',
          'Media Service',
          'Cache (Redis)',
          'Database (PostgreSQL)',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ Desktop App │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   WebSocket Gateway   │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│  Message Service  │ │User Service│ │Group Service│
└─────────┬─────────┘ └─┬─────────┘ └─┬─────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
              ┌───────────▼───────────┐
              │      Cache (Redis)    │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │   Database (PostgreSQL)│
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'users',
            fields: ['id', 'username', 'email', 'password_hash', 'created_at'],
            indexes: ['username', 'email'],
          },
          {
            name: 'messages',
            fields: ['id', 'sender_id', 'receiver_id', 'content', 'message_type', 'created_at'],
            indexes: ['sender_id', 'receiver_id', 'created_at'],
          },
          {
            name: 'groups',
            fields: ['id', 'name', 'created_by', 'created_at'],
            indexes: ['created_by'],
          },
        ],
      },
      optimization: {
        caching: [
          'User sessions in Redis',
          'Recent messages in cache',
          'User presence indicators',
        ],
        scaling: [
          'WebSocket connection pooling',
          'Message queue for async processing',
          'Database read replicas',
        ],
      },
      security: [
        'End-to-end encryption',
        'Secure WebSocket connections',
        'User authentication',
        'Rate limiting',
      ],
    },
    'notification-system': {
      title: 'Notification System',
      icon: '🔔',
      description: 'Design a multi-channel notification delivery system with personalization and analytics.',
      difficulty: 'Intermediate',
      category: 'Communication',
      scale: 'Very High',
      complexity: 'High',
      requirements: {
        functional: [
          'Multi-channel Delivery: Email, SMS, Push, In-app',
          'Personalization: User preferences and targeting',
          'Templates: Dynamic content and localization',
          'Scheduling: Time-based and event-triggered',
          'Analytics: Delivery tracking and engagement metrics',
        ],
        nonFunctional: [
          'Scale: Handle 1B+ notifications per day',
          'Performance: < 100ms delivery time',
          'Reliability: 99.99% delivery success',
          'Latency: Real-time notification delivery',
        ],
      },
      scaleEstimation: {
        notifications: '1B notifications per day',
        users: '500M users',
        channels: '4 channels (Email, SMS, Push, In-app)',
        storage: '100GB notifications + 50GB analytics per day',
      },
      architecture: {
        components: [
          'Notification Service',
          'Template Engine',
          'Channel Services (Email, SMS, Push)',
          'Queue System (Kafka)',
          'Analytics Service',
          'User Preference Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐
│ Application │    │ User Action │
└─────┬───────┘    └─────┬───────┘
      │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │ Notification Service  │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │   Queue (Kafka)      │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│  Email Service    │ │SMS Service│ │Push Service│
└───────────────────┘ └───────────┘ └───────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'notifications',
            fields: ['id', 'user_id', 'type', 'content', 'channel', 'status', 'created_at'],
            indexes: ['user_id', 'type', 'status', 'created_at'],
          },
          {
            name: 'user_preferences',
            fields: ['user_id', 'channel', 'enabled', 'frequency', 'updated_at'],
            indexes: ['user_id', 'channel'],
          },
        ],
      },
      optimization: {
        caching: [
          'User preferences in Redis: TTL 1 hour',
          'Template cache: TTL 30 minutes',
        ],
        scaling: [
          'Horizontal scaling of channel services',
          'Queue partitioning by channel type',
          'Database sharding by user_id',
        ],
      },
      security: [
        'User consent management',
        'Rate limiting per user',
        'Content sanitization',
        'Secure channel authentication',
      ],
    },
    'ecommerce-platform': {
      title: 'E-commerce Platform',
      icon: '🛒',
      description: 'Design an Amazon-like platform with inventory management, recommendations, and logistics.',
      difficulty: 'Advanced',
      category: 'E-commerce',
      scale: 'Very High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'Product Catalog: Search, browse, and filter',
          'Inventory Management: Stock tracking and updates',
          'Shopping Cart: Add, remove, and modify items',
          'Order Processing: Checkout and payment',
          'Recommendations: Personalized product suggestions',
          'Logistics: Shipping and delivery tracking',
        ],
        nonFunctional: [
          'Scale: Handle 100M+ products and 10M+ orders per day',
          'Performance: < 200ms page load time',
          'Availability: 99.99% uptime',
          'Consistency: Strong consistency for inventory',
        ],
      },
      scaleEstimation: {
        products: '100M+ products',
        orders: '10M orders per day',
        users: '50M daily active users',
        storage: '1TB products + 100GB orders per day',
      },
      architecture: {
        components: [
          'Product Service',
          'Inventory Service',
          'Order Service',
          'Payment Service',
          'Recommendation Engine',
          'Search Service (Elasticsearch)',
          'Logistics Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ Admin Panel │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   API Gateway        │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Product Service   │ │Inventory  │ │Order      │
└───────────────────┘ │Service    │ │Service    │
                      └───────────┘ └───────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'products',
            fields: ['id', 'name', 'description', 'price', 'category', 'inventory_count'],
            indexes: ['category', 'price', 'name'],
          },
          {
            name: 'orders',
            fields: ['id', 'user_id', 'total_amount', 'status', 'created_at'],
            indexes: ['user_id', 'status', 'created_at'],
          },
        ],
      },
      optimization: {
        caching: [
          'Product catalog in Redis: TTL 1 hour',
          'User session data: TTL 30 minutes',
          'Search results: TTL 5 minutes',
        ],
        scaling: [
          'Microservices architecture',
          'Database sharding by category',
          'CDN for product images',
          'Read replicas for search queries',
        ],
      },
      security: [
        'Payment data encryption',
        'User authentication and authorization',
        'Fraud detection systems',
        'Secure inventory management',
      ],
    },
    'video-streaming': {
      title: 'Video Streaming Platform',
      icon: '🎥',
      description: 'Design a YouTube-like platform with adaptive bitrate streaming, content delivery, and recommendations.',
      difficulty: 'Advanced',
      category: 'Media',
      scale: 'Extremely High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'Video Upload: Support multiple formats and resolutions',
          'Adaptive Streaming: HLS/DASH with quality switching',
          'Content Delivery: Global CDN for fast streaming',
          'User Management: Profiles, subscriptions, playlists',
          'Recommendations: Personalized video suggestions',
          'Analytics: View counts, engagement metrics',
          'Content Moderation: Filter inappropriate content',
        ],
        nonFunctional: [
          'Scale: Handle 1B+ videos and 100M+ daily views',
          'Performance: < 2s video start time',
          'Availability: 99.99% uptime',
          'Bandwidth: Optimize for different network conditions',
          'Storage: Efficient video encoding and storage',
        ],
      },
      scaleEstimation: {
        videos: '1B+ videos',
        dailyViews: '100M+ daily views',
        users: '500M+ registered users',
        storage: '10PB+ video storage',
        bandwidth: '100TB+ daily bandwidth',
      },
      architecture: {
        components: [
          'Video Upload Service',
          'Transcoding Service (FFmpeg)',
          'Content Delivery Network (CDN)',
          'Video Streaming Service',
          'User Management Service',
          'Recommendation Engine',
          'Analytics Service',
          'Content Moderation Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ Smart TV    │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Video Upload      │ │Transcoding│ │Streaming  │
│ Service           │ │Service    │ │Service    │
└───────────────────┘ └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Global CDN         │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'videos',
            fields: ['id', 'title', 'description', 'user_id', 'duration', 'views', 'created_at'],
            indexes: ['user_id', 'views', 'created_at', 'title'],
          },
          {
            name: 'video_qualities',
            fields: ['id', 'video_id', 'quality', 'bitrate', 'resolution', 'url'],
            indexes: ['video_id', 'quality'],
          },
          {
            name: 'user_interactions',
            fields: ['id', 'user_id', 'video_id', 'action', 'timestamp'],
            indexes: ['user_id', 'video_id', 'action'],
          },
        ],
      },
      optimization: {
        caching: [
          'Video chunks in CDN: TTL based on popularity',
          'User preferences in Redis: TTL 1 hour',
          'Recommendations in cache: TTL 30 minutes',
        ],
        scaling: [
          'Multi-region CDN deployment',
          'Horizontal scaling of streaming services',
          'Database sharding by user_id',
          'Video transcoding in parallel',
        ],
      },
      security: [
        'Content encryption (DRM)',
        'User authentication and authorization',
        'Content moderation and filtering',
        'Rate limiting for uploads',
        'Secure video delivery',
      ],
    },
    'messaging-platform': {
      title: 'Messaging Platform',
      icon: '💬',
      description: 'Design a WhatsApp-like messaging platform with real-time communication, group chats, and media sharing.',
      difficulty: 'Advanced',
      category: 'Communication',
      scale: 'Extremely High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'Real-time Messaging: Instant message delivery',
          'Group Chats: Support multiple participants',
          'Media Sharing: Images, videos, documents, voice notes',
          'User Management: Profiles, contacts, status',
          'Message Encryption: End-to-end encryption',
          'Push Notifications: Offline message alerts',
          'Message Search: Find specific conversations',
          'File Storage: Media and document management',
        ],
        nonFunctional: [
          'Scale: Handle 2B+ users and 100B+ messages per day',
          'Performance: < 100ms message delivery',
          'Availability: 99.99% uptime',
          'Security: End-to-end encryption',
          'Reliability: Message delivery guarantees',
        ],
      },
      scaleEstimation: {
        users: '2B+ daily active users',
        messages: '100B+ messages per day',
        mediaFiles: '50B+ media files shared daily',
        storage: '100PB+ total storage',
        bandwidth: '500TB+ daily bandwidth',
      },
      architecture: {
        components: [
          'Message Service',
          'User Management Service',
          'Media Service',
          'Push Notification Service',
          'WebSocket Gateway',
          'Message Queue (Kafka)',
          'File Storage (S3)',
          'Encryption Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ Desktop App │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
              ┌───────────▼───────────┐
              │ WebSocket Gateway    │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Message Service   │ │User Mgmt  │ │Media      │
└───────────────────┘ │Service    │ │Service    │
                      └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Message Queue      │
              │      (Kafka)         │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'users',
            fields: ['id', 'username', 'phone', 'status', 'last_seen', 'created_at'],
            indexes: ['phone', 'username', 'last_seen'],
          },
          {
            name: 'conversations',
            fields: ['id', 'type', 'name', 'created_by', 'created_at'],
            indexes: ['created_by', 'type'],
          },
          {
            name: 'messages',
            fields: ['id', 'conversation_id', 'sender_id', 'content', 'type', 'created_at'],
            indexes: ['conversation_id', 'sender_id', 'created_at'],
          },
          {
            name: 'media_files',
            fields: ['id', 'message_id', 'file_url', 'file_type', 'file_size', 'created_at'],
            indexes: ['message_id', 'file_type'],
          },
        ],
      },
      optimization: {
        caching: [
          'Recent messages in Redis: TTL 1 hour',
          'User sessions in cache: TTL 30 minutes',
          'Contact lists in memory: TTL 15 minutes',
        ],
        scaling: [
          'Horizontal scaling with message queues',
          'Database sharding by user_id',
          'CDN for media file delivery',
          'WebSocket connection pooling',
        ],
      },
      security: [
        'End-to-end encryption (Signal Protocol)',
        'Secure WebSocket connections (WSS)',
        'User authentication and authorization',
        'Rate limiting for message sending',
        'Media file scanning and validation',
      ],
    },
    'ride-sharing': {
      title: 'Ride-Sharing Platform',
      icon: '🚗',
      description: 'Design an Uber-like platform with real-time ride matching, payment processing, and driver management.',
      difficulty: 'Advanced',
      category: 'Transportation',
      scale: 'Extremely High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'User Registration: Rider and driver accounts',
          'Ride Booking: Location-based ride requests',
          'Driver Matching: Real-time driver assignment',
          'Real-time Tracking: Live location updates',
          'Payment Processing: Secure payment handling',
          'Rating System: Driver and rider reviews',
          'Route Optimization: Best path calculation',
          'Emergency Support: Safety features and alerts',
        ],
        nonFunctional: [
          'Scale: Handle 10M+ rides per day',
          'Performance: < 5s ride matching time',
          'Availability: 99.99% uptime',
          'Real-time: < 10s location updates',
          'Security: Secure payment and user data',
        ],
      },
      scaleEstimation: {
        users: '100M+ registered users',
        rides: '10M+ rides per day',
        drivers: '5M+ active drivers',
        transactions: '15M+ daily transactions',
        storage: '50PB+ total storage',
      },
      architecture: {
        components: [
          'User Management Service',
          'Ride Matching Service',
          'Location Service',
          'Payment Service',
          'Driver Management Service',
          'Real-time Tracking Service',
          'Route Optimization Service',
          'Notification Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Rider App   │    │ Driver App  │    │ Web Portal  │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   API Gateway        │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Ride Matching     │ │Location   │ │Payment    │
│ Service           │ │Service    │ │Service    │
└───────────────────┘ └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Real-time Queue    │
              │      (Kafka)         │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'users',
            fields: ['id', 'type', 'name', 'phone', 'email', 'rating', 'created_at'],
            indexes: ['type', 'phone', 'email', 'rating'],
          },
          {
            name: 'rides',
            fields: ['id', 'rider_id', 'driver_id', 'status', 'pickup', 'destination', 'created_at'],
            indexes: ['rider_id', 'driver_id', 'status', 'created_at'],
          },
          {
            name: 'locations',
            fields: ['id', 'user_id', 'latitude', 'longitude', 'timestamp'],
            indexes: ['user_id', 'timestamp'],
          },
        ],
      },
      optimization: {
        caching: [
          'User locations in Redis: TTL 30 seconds',
          'Driver availability in cache: TTL 1 minute',
          'Route data in cache: TTL 5 minutes',
        ],
        scaling: [
          'Microservices architecture',
          'Geographic sharding by region',
          'Real-time message queues',
          'CDN for static assets',
        ],
      },
      security: [
        'User authentication and verification',
        'Secure payment processing',
        'Location data encryption',
        'Driver background checks',
        'Emergency response systems',
      ],
    },
    'search-engine': {
      title: 'Search Engine',
      icon: '🔍',
      description: 'Design a Google-like search engine with web crawling, indexing, and relevance ranking.',
      difficulty: 'Advanced',
      category: 'Information Retrieval',
      scale: 'Extremely High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'Web Crawling: Discover and index web pages',
          'Content Indexing: Store and organize web content',
          'Search Query Processing: Parse and understand queries',
          'Relevance Ranking: Rank results by importance',
          'Autocomplete: Suggest search terms',
          'Spell Correction: Handle typos and mistakes',
          'Personalization: User-specific results',
          'Analytics: Search behavior tracking',
        ],
        nonFunctional: [
          'Scale: Index 100B+ web pages',
          'Performance: < 200ms search response',
          'Availability: 99.99% uptime',
          'Accuracy: High relevance ranking',
          'Freshness: Regular content updates',
        ],
      },
      scaleEstimation: {
        webPages: '100B+ indexed pages',
        searches: '5B+ daily searches',
        users: '2B+ daily users',
        storage: '1EB+ total storage',
        bandwidth: '1PB+ daily bandwidth',
      },
      architecture: {
        components: [
          'Web Crawler Service',
          'Indexing Service',
          'Search Service',
          'Ranking Algorithm',
          'Query Processing Service',
          'Analytics Service',
          'Content Storage (BigTable)',
          'Cache Layer (Redis)',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ API Client  │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Search Service    │ │Indexing   │ │Web        │
└───────────────────┘ │Service    │ │Crawler    │
                      └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Content Storage    │
              │     (BigTable)       │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'web_pages',
            fields: ['id', 'url', 'title', 'content', 'rank_score', 'last_crawled'],
            indexes: ['url', 'rank_score', 'last_crawled'],
          },
          {
            name: 'search_queries',
            fields: ['id', 'query', 'user_id', 'timestamp', 'results_clicked'],
            indexes: ['query', 'user_id', 'timestamp'],
          },
          {
            name: 'page_rankings',
            fields: ['page_id', 'domain_authority', 'page_authority', 'backlinks'],
            indexes: ['page_id', 'domain_authority'],
          },
        ],
      },
      optimization: {
        caching: [
          'Search results in Redis: TTL 1 hour',
          'Query suggestions in cache: TTL 30 minutes',
          'Page rankings in memory: TTL 24 hours',
        ],
        scaling: [
          'Distributed crawling across regions',
          'Sharded indexing by content type',
          'CDN for static content delivery',
          'Read replicas for search queries',
        ],
      },
      security: [
        'Content filtering and moderation',
        'User privacy protection',
        'Secure crawling protocols',
        'Rate limiting for API access',
        'Malicious content detection',
      ],
    },
    'video-platform': {
      title: 'Video Platform',
      icon: '📺',
      description: 'Design a Netflix-like video streaming platform with content management, recommendations, and adaptive streaming.',
      difficulty: 'Advanced',
      category: 'Media Streaming',
      scale: 'Extremely High',
      complexity: 'Very High',
      requirements: {
        functional: [
          'Video Library: Content catalog management',
          'Streaming Service: Adaptive bitrate streaming',
          'User Management: Profiles, watchlists, history',
          'Recommendations: Personalized content suggestions',
          'Content Discovery: Search and browse functionality',
          'Multi-device Support: TV, mobile, web, console',
          'Offline Viewing: Download for offline use',
          'Parental Controls: Age-appropriate content',
        ],
        nonFunctional: [
          'Scale: Handle 200M+ subscribers',
          'Performance: < 3s video start time',
          'Availability: 99.99% uptime',
          'Quality: 4K HDR streaming support',
          'Bandwidth: Optimize for different connections',
        ],
      },
      scaleEstimation: {
        subscribers: '200M+ paid subscribers',
        videos: '50K+ movies and shows',
        dailyStreams: '500M+ daily streams',
        storage: '500PB+ video storage',
        bandwidth: '1PB+ daily bandwidth',
      },
      architecture: {
        components: [
          'Content Management Service',
          'Video Streaming Service',
          'User Management Service',
          'Recommendation Engine',
          'Content Delivery Network (CDN)',
          'Analytics Service',
          'Billing Service',
          'Content Encoding Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Smart TV    │    │ Mobile App  │    │ Web Client  │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Content Mgmt      │ │Streaming  │ │User Mgmt  │
│ Service           │ │Service    │ │Service    │
└───────────────────┘ └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Global CDN         │
              │   (Multi-region)     │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'content',
            fields: ['id', 'title', 'type', 'genre', 'duration', 'rating', 'release_date'],
            indexes: ['type', 'genre', 'rating', 'release_date'],
          },
          {
            name: 'user_watchlist',
            fields: ['id', 'user_id', 'content_id', 'added_at', 'watched'],
            indexes: ['user_id', 'content_id', 'added_at'],
          },
          {
            name: 'streaming_sessions',
            fields: ['id', 'user_id', 'content_id', 'start_time', 'duration', 'quality'],
            indexes: ['user_id', 'content_id', 'start_time'],
          },
        ],
      },
      optimization: {
        caching: [
          'Popular content in CDN: TTL based on popularity',
          'User preferences in Redis: TTL 1 hour',
          'Recommendations in cache: TTL 30 minutes',
        ],
        scaling: [
          'Multi-region CDN deployment',
          'Content encoding in parallel',
          'Database sharding by content type',
          'Horizontal scaling of streaming services',
        ],
      },
      security: [
        'Content DRM protection',
        'User authentication and authorization',
        'Secure video delivery',
        'Content licensing compliance',
        'Geographic content restrictions',
      ],
    },
    'instagram': {
      title: 'Instagram',
      icon: '📸',
      description: 'Design an Instagram-like social media platform with photo sharing, stories, reels, and social interactions.',
      difficulty: 'Intermediate',
      category: 'Social Media',
      scale: 'Very High',
      complexity: 'High',
      requirements: {
        functional: [
          'Photo/Video Sharing: Upload and share media content',
          'Stories: 24-hour temporary content',
          'Reels: Short-form video content',
          'User Profiles: Bio, posts, followers, following',
          'Feed Generation: Personalized content timeline',
          'Direct Messaging: Private conversations',
          'Explore Page: Content discovery and recommendations',
          'Hashtags & Search: Content categorization and discovery',
        ],
        nonFunctional: [
          'Scale: Handle 1B+ users and 100M+ posts per day',
          'Performance: < 2s feed load time',
          'Availability: 99.9% uptime',
          'Media Quality: High-resolution image and video support',
          'Real-time: Instant notifications and updates',
        ],
      },
      scaleEstimation: {
        users: '1B+ daily active users',
        posts: '100M+ posts per day',
        stories: '500M+ stories per day',
        media: '50PB+ total media storage',
        bandwidth: '200TB+ daily bandwidth',
      },
      architecture: {
        components: [
          'Media Upload Service',
          'Feed Generation Service',
          'User Management Service',
          'Content Discovery Service',
          'Notification Service',
          'Media Storage (S3)',
          'Content Delivery Network (CDN)',
          'Recommendation Engine',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Web Client  │    │ Mobile App  │    │ API Client  │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   Load Balancer      │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Media Upload      │ │Feed       │ │User Mgmt  │
│ Service           │ │Service    │ │Service    │
└───────────────────┘ └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   Media Storage      │
              │      (S3 + CDN)      │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'users',
            fields: ['id', 'username', 'email', 'bio', 'followers_count', 'following_count', 'created_at'],
            indexes: ['username', 'email', 'followers_count'],
          },
          {
            name: 'posts',
            fields: ['id', 'user_id', 'caption', 'media_urls', 'likes_count', 'comments_count', 'created_at'],
            indexes: ['user_id', 'created_at', 'likes_count'],
          },
          {
            name: 'stories',
            fields: ['id', 'user_id', 'media_url', 'expires_at', 'created_at'],
            indexes: ['user_id', 'expires_at', 'created_at'],
          },
          {
            name: 'user_relationships',
            fields: ['id', 'follower_id', 'following_id', 'created_at'],
            indexes: ['follower_id', 'following_id'],
          },
        ],
      },
      optimization: {
        caching: [
          'User feeds in Redis: TTL 5 minutes',
          'Popular posts in CDN: TTL based on engagement',
          'User relationships in cache: TTL 1 hour',
        ],
        scaling: [
          'Horizontal scaling with load balancers',
          'Database sharding by user_id',
          'CDN for media file delivery',
          'Read replicas for feed queries',
        ],
      },
      security: [
        'User authentication and verification',
        'Content moderation and filtering',
        'Rate limiting for uploads',
        'Secure media file storage',
        'Privacy controls for user content',
      ],
    },
    'payment-system': {
      title: 'Payment System',
      icon: '💳',
      description: 'Design a secure payment processing system with multiple payment methods, fraud detection, and compliance.',
      difficulty: 'Intermediate',
      category: 'Financial',
      scale: 'Very High',
      complexity: 'High',
      requirements: {
        functional: [
          'Payment Processing: Credit cards, digital wallets, bank transfers',
          'Multiple Gateways: Support various payment providers',
          'Transaction Management: Payment tracking and history',
          'Refund Processing: Automated and manual refunds',
          'Subscription Billing: Recurring payment handling',
          'Fraud Detection: Real-time risk assessment',
          'Compliance: PCI DSS, GDPR, regional regulations',
          'Reporting: Transaction analytics and reconciliation',
        ],
        nonFunctional: [
          'Scale: Handle 10M+ transactions per day',
          'Performance: < 500ms payment processing',
          'Availability: 99.99% uptime',
          'Security: PCI DSS Level 1 compliance',
          'Reliability: 99.9% transaction success rate',
        ],
      },
      scaleEstimation: {
        transactions: '10M+ daily transactions',
        users: '100M+ registered users',
        merchants: '1M+ merchant accounts',
        volume: '$1B+ daily transaction volume',
        storage: '100TB+ transaction data',
      },
      architecture: {
        components: [
          'Payment Gateway Service',
          'Transaction Service',
          'Fraud Detection Service',
          'Compliance Service',
          'Settlement Service',
          'Risk Management Service',
          'Reporting Service',
          'Notification Service',
        ],
        diagram: `
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ E-commerce  │    │ Mobile App  │    │ POS System  │
└─────┬───────┘    └─────┬───────┘    └─────┬───────┘
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
              ┌───────────▼───────────┐
              │   API Gateway        │
              └───────────┬───────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
┌─────────▼─────────┐ ┌─▼─────────┐ ┌─▼─────────┐
│ Payment Gateway   │ │Fraud      │ │Transaction│
│ Service           │ │Detection  │ │Service    │
└───────────────────┘ └───────────┘ └───────────┘
                         │
              ┌───────────▼───────────┐
              │   External Payment    │
              │      Providers        │
              └───────────────────────┘
        `,
      },
      database: {
        tables: [
          {
            name: 'transactions',
            fields: ['id', 'user_id', 'merchant_id', 'amount', 'currency', 'status', 'payment_method', 'created_at'],
            indexes: ['user_id', 'merchant_id', 'status', 'created_at'],
          },
          {
            name: 'payment_methods',
            fields: ['id', 'user_id', 'type', 'token', 'last_four', 'expiry_date', 'is_default'],
            indexes: ['user_id', 'type', 'is_default'],
          },
          {
            name: 'fraud_attempts',
            fields: ['id', 'transaction_id', 'risk_score', 'fraud_type', 'blocked', 'created_at'],
            indexes: ['transaction_id', 'risk_score', 'blocked'],
          },
        ],
      },
      optimization: {
        caching: [
          'User payment methods in Redis: TTL 1 hour',
          'Fraud risk scores in cache: TTL 5 minutes',
          'Transaction status in cache: TTL 30 minutes',
        ],
        scaling: [
          'Microservices architecture',
          'Database sharding by merchant_id',
          'Horizontal scaling of payment gateways',
          'Geographic distribution for compliance',
        ],
      },
      security: [
        'PCI DSS Level 1 compliance',
        'End-to-end encryption',
        'Tokenization of sensitive data',
        'Multi-factor authentication',
        'Real-time fraud monitoring',
        'Secure key management',
      ],
    },
  };

  const problem = problemData[problemId];

  if (!problem) {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Problem Not Found
          </Typography>
          <Button component={RouterLink} to="/problems" startIcon={<ArrowBack />}>
            Back to Problems
          </Button>
        </Box>
      </Container>
    );
  }

  const tabLabels = ['Overview', 'Architecture', 'Database', 'Optimization', 'Security'];

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          component={RouterLink}
          to="/problems"
          startIcon={<ArrowBack />}
          sx={{ 
            mb: { xs: 3, md: 4 },
            py: { xs: 1, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
          fullWidth={isMobile}
        >
          Back to Problems
        </Button>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 4, md: 5 }, 
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography 
            variant={isMobile ? "h2" : "h1"} 
            sx={{ 
              mr: { xs: 0, sm: 3 }, 
              mb: { xs: 2, sm: 0 },
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }
            }}
          >
            {problem.icon}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
                mb: { xs: 2, md: 3 }
              }}
            >
              {problem.title}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap', 
              justifyContent: { xs: 'center', sm: 'flex-start' },
              mb: { xs: 2, md: 3 }
            }}>
              <Chip
                label={problem.difficulty}
                color={
                  problem.difficulty === 'Basic' ? 'success' :
                  problem.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
              <Chip 
                label={problem.category} 
                variant="outlined" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
              <Chip 
                label={`Scale: ${problem.scale}`} 
                color="info" 
                variant="outlined"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
              <Chip 
                label={`Complexity: ${problem.complexity}`} 
                color="secondary" 
                variant="outlined"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: '90%'
              }}
            >
              {problem.description}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 4, md: 5 } }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{
            '& .MuiTab-root': {
              minHeight: { xs: 48, sm: 56 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              textTransform: 'none',
              px: { xs: 2, sm: 3 },
            },
          }}
        >
          {tabLabels.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ pb: { xs: 6, md: 8 } }}>
        {selectedTab === 0 && (
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Requirements & Scale Estimation
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Functional Requirements
                  </Typography>
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    {problem.requirements.functional.map((req, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mb: 1,
                        gap: 1
                      }}>
                        <Box sx={{ 
                          color: 'success.main', 
                          mt: 0.2,
                          flexShrink: 0
                        }}>
                          ✓
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.5
                          }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Non-Functional Requirements
                  </Typography>
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    {problem.requirements.nonFunctional.map((req, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mb: 1,
                        gap: 1
                      }}>
                        <Box sx={{ 
                          color: 'info.main', 
                          mt: 0.2,
                          flexShrink: 0
                        }}>
                          ⚡
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.5
                          }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: { xs: 4, md: 5 } }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  mb: { xs: 3, md: 4 },
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                Scale Estimation
              </Typography>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {Object.entries(problem.scaleEstimation).map(([key, value]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <Paper sx={{ 
                      p: { xs: 2, md: 3 }, 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography 
                        variant="h6" 
                        color="primary.main"
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          mb: 1
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          textTransform: 'capitalize',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          fontWeight: 'bold'
                        }}
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              System Architecture
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    System Components
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {problem.architecture.components.map((component, index) => (
                      <Chip
                        key={index}
                        label={component}
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          height: { xs: 28, sm: 32 }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' }
                    }}
                  >
                    Architecture Diagram
                  </Typography>
                  <Box sx={{ 
                    backgroundColor: 'grey.50', 
                    p: 2, 
                    borderRadius: 1,
                    overflow: 'auto'
                  }}>
                    <pre style={{ 
                      margin: 0, 
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                      lineHeight: 1.4,
                      fontFamily: 'monospace'
                    }}>
                      {problem.architecture.diagram}
                    </pre>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Database Design
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {problem.database.tables.map((table, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        mb: { xs: 2, md: 3 },
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        color: 'primary.main'
                      }}
                    >
                      Table: {table.name}
                    </Typography>
                    
                    <Box sx={{ mb: { xs: 2, md: 3 } }}>
                      <Typography 
                        variant="subtitle2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        Fields:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {table.fields.map((field, fieldIndex) => (
                          <Chip
                            key={fieldIndex}
                            label={field}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        Indexes:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {table.indexes.map((index, indexIndex) => (
                          <Chip
                            key={indexIndex}
                            label={index}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: 20, sm: 24 }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {selectedTab === 3 && (
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Performance Optimization
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      color: 'success.main'
                    }}
                  >
                    Caching Strategies
                  </Typography>
                  <Box>
                    {problem.optimization.caching.map((strategy, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mb: 1,
                        gap: 1
                      }}>
                        <Box sx={{ 
                          color: 'success.main', 
                          mt: 0.2,
                          flexShrink: 0
                        }}>
                          🚀
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.5
                          }}
                        >
                          {strategy}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      color: 'info.main'
                    }}
                  >
                    Scaling Strategies
                  </Typography>
                  <Box>
                    {problem.optimization.scaling.map((strategy, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        mb: 1,
                        gap: 1
                      }}>
                        <Box sx={{ 
                          color: 'info.main', 
                          mt: 0.2,
                          flexShrink: 0
                        }}>
                          📈
                        </Box>
                        <Typography 
                          variant="body2"
                          sx={{ 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.5
                          }}
                        >
                          {strategy}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedTab === 4 && (
          <Box>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: { xs: 3, md: 4 },
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              Security Considerations
            </Typography>
            
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {problem.security.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper sx={{ 
                    p: { xs: 3, md: 4 }, 
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'warning.light',
                    backgroundColor: 'warning.light',
                    '& .MuiBox-root': {
                      backgroundColor: 'background.paper',
                      height: '100%',
                      p: { xs: 2, md: 3 },
                      borderRadius: 1
                    }
                  }}>
                    <Box>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          lineHeight: 1.5,
                          fontWeight: 'medium'
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      {/* Additional Resources */}
      <Box sx={{ mt: 6 }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          🚀 Next Steps
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <School color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Practice Implementation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Try implementing this system design on paper or using diagramming tools
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Code color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Explore Similar Problems
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Look at related system design problems to build your knowledge
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Scale Up
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Consider how this system would scale to handle even larger loads
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProblemDetail;
