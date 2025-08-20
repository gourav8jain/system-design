import React, { useState, useEffect } from 'react';
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
  ListItemIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  TrendingUp,
  Speed,
  Security,
  Cloud,
  Architecture,
  Storage,
  Code,
  School,
  ArrowBack,
} from '@mui/icons-material';

const ProblemDetail = () => {
  const { problemId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [expanded, setExpanded] = useState('panel1');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Mock data for different problems - in a real app, this would come from an API
  const problemData = {
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
  };

  const problem = problemData[problemId];

  if (!problem) {
    return (
      <Container maxWidth="lg">
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
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ py: 4 }}>
        <Button
          component={RouterLink}
          to="/problems"
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Problems
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h1" sx={{ mr: 2 }}>
            {problem.icon}
          </Typography>
          <Box>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {problem.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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

        <Typography variant="h6" color="text.secondary" paragraph>
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
          <Grid container spacing={4} sx={{ mb: 4 }}>
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
                  fontSize: '0.8rem',
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
          <Grid container spacing={4}>
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
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
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
