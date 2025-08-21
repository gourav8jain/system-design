import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  Speed,
  ArrowBack,
  School,
  Code,
} from '@mui/icons-material';

const ProblemDetail = () => {
  const { problemId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

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
      <Box sx={{ py: { xs: 3, md: 4 } }}>
        <Button
          component={RouterLink}
          to="/problems"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
          fullWidth={isMobile}
        >
          Back to Problems
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Typography variant={isMobile ? "h2" : "h1"} sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
            {problem.icon}
          </Typography>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant={isMobile ? "h3" : "h2"} component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {problem.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                label={problem.difficulty}
                color={
                  problem.difficulty === 'Basic' ? 'success' :
                  problem.difficulty === 'Intermediate' ? 'warning' : 'error'
                }
              />
              <Chip label={problem.category} variant="outlined" />
              <Chip label={`Scale: ${problem.scale}`} color="info" variant="outlined" />
              <Chip label={`Complexity: ${problem.complexity}`} color="secondary" variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" paragraph>
          {problem.description}
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTab-root': { py: 2 } }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Box>
          {/* Requirements */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    <CheckCircle color="primary" sx={{ mr: 1 }} />
                    Functional Requirements
                  </Typography>
                  <List dense>
                    {problem.requirements.functional.map((req, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={req} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    <TrendingUp color="primary" sx={{ mr: 1 }} />
                    Non-Functional Requirements
                  </Typography>
                  <List dense>
                    {problem.requirements.nonFunctional.map((req, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={req} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Scale Estimation */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                📊 Scale Estimation
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(problem.scaleEstimation).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={3} key={key}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                🏗️ System Components
              </Typography>
              <Grid container spacing={2}>
                {problem.architecture.components.map((component, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Chip
                      label={component}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                📐 Architecture Diagram
              </Typography>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                }}
              >
                {problem.architecture.diagram}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedTab === 2 && (
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                🗄️ Database Design
              </Typography>
              <Grid container spacing={3}>
                {problem.database.tables.map((table, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {table.name} Table
                      </Typography>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Fields:</strong>
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {table.fields.map((field, idx) => (
                          <Chip
                            key={idx}
                            label={field}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Indexes:</strong>
                      </Typography>
                      <Box>
                        {table.indexes.map((index, idx) => (
                          <Chip
                            key={idx}
                            label={index}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

      {selectedTab === 3 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    <Speed color="primary" sx={{ mr: 1 }} />
                    Caching Strategy
                  </Typography>
                  <List dense>
                    {problem.optimization.caching.map((strategy, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={strategy} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    <TrendingUp color="primary" sx={{ mr: 1 }} />
                    Scaling Strategies
                  </Typography>
                  <List dense>
                    {problem.optimization.scaling.map((strategy, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={strategy} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {selectedTab === 4 && (
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                🔒 Security Considerations
              </Typography>
              <Grid container spacing={2}>
                {problem.security.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Chip
                      label={item}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}

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
