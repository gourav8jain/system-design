import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search, Code, TrendingUp, School } from '@mui/icons-material';

const Problems = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const problems = {
    basic: [
      {
        id: 'url-shortener',
        title: 'URL Shortener',
        description: 'Design a URL shortening service like bit.ly with analytics and custom domains',
        category: 'Web Services',
        icon: '🔗',
        features: ['URL Generation', 'Analytics', 'Custom Domains', 'Rate Limiting'],
        scale: 'Medium',
        complexity: 'Low',
      },
      {
        id: 'rate-limiter',
        title: 'Rate Limiter',
        description: 'Implement distributed rate limiting with multiple algorithms and strategies',
        category: 'Infrastructure',
        icon: '⏱️',
        features: ['Token Bucket', 'Leaky Bucket', 'Fixed Window', 'Sliding Window'],
        scale: 'High',
        complexity: 'Medium',
      },
      {
        id: 'chat-application',
        title: 'Chat Application',
        description: 'Real-time messaging application with encryption and group chat capabilities',
        category: 'Communication',
        icon: '💬',
        features: ['Real-time Messaging', 'End-to-End Encryption', 'Group Chats', 'File Sharing'],
        scale: 'High',
        complexity: 'Medium',
      },
    ],
    intermediate: [
      {
        id: 'twitter-clone',
        title: 'Twitter Clone',
        description: 'Social media platform with real-time feeds, interactions, and search capabilities',
        category: 'Social Media',
        icon: '🐦',
        features: ['Timeline Generation', 'Real-time Updates', 'Search & Discovery', 'Content Moderation'],
        scale: 'Very High',
        complexity: 'High',
      },
      {
        id: 'notification-system',
        title: 'Notification System',
        description: 'Multi-channel notification delivery system with personalization and analytics',
        category: 'Communication',
        icon: '🔔',
        features: ['Multi-channel Delivery', 'Personalization', 'Analytics', 'A/B Testing'],
        scale: 'Very High',
        complexity: 'High',
      },
      {
        id: 'payment-system',
        title: 'Payment System',
        description: 'Secure payment processing with fraud detection and multiple payment methods',
        category: 'Financial',
        icon: '💳',
        features: ['Payment Processing', 'Fraud Detection', 'Multiple Gateways', 'Compliance'],
        scale: 'Very High',
        complexity: 'Very High',
      },
      {
        id: 'video-streaming',
        title: 'Video Streaming',
        description: 'Media streaming platform with adaptive bitrate and content delivery optimization',
        category: 'Media',
        icon: '🎥',
        features: ['Adaptive Bitrate', 'CDN Optimization', 'Content Delivery', 'Analytics'],
        scale: 'Very High',
        complexity: 'High',
      },
      {
        id: 'instagram',
        title: 'Instagram',
        description: 'Photo sharing platform with social features, stories, and recommendation system',
        category: 'Social Media',
        icon: '📸',
        features: ['Photo Sharing', 'Stories', 'Recommendations', 'Content Discovery'],
        scale: 'Very High',
        complexity: 'High',
      },
    ],
    advanced: [
      {
        id: 'messaging-platform',
        title: 'Messaging Platform',
        description: 'WhatsApp-like platform with end-to-end encryption and real-time messaging',
        category: 'Communication',
        icon: '📱',
        features: ['E2E Encryption', 'Real-time Messaging', 'Media Sharing', 'Group Management'],
        scale: 'Very High',
        complexity: 'Very High',
      },
      {
        id: 'ecommerce-platform',
        title: 'E-commerce Platform',
        description: 'Amazon-like platform with inventory management, recommendations, and logistics',
        category: 'E-commerce',
        icon: '🛒',
        features: ['Inventory Management', 'Recommendations', 'Logistics', 'Analytics'],
        scale: 'Very High',
        complexity: 'Very High',
      },
      {
        id: 'ride-sharing',
        title: 'Ride-Sharing',
        description: 'Uber-like platform with real-time location tracking and driver matching',
        category: 'Transportation',
        icon: '🚗',
        features: ['Real-time Tracking', 'Driver Matching', 'Pricing', 'Safety Features'],
        scale: 'Very High',
        complexity: 'Very High',
      },
      {
        id: 'search-engine',
        title: 'Search Engine',
        description: 'Google-like search engine with web crawling, indexing, and ranking algorithms',
        category: 'Search',
        icon: '🔍',
        features: ['Web Crawling', 'Indexing', 'Ranking', 'Personalization'],
        scale: 'Extremely High',
        complexity: 'Very High',
      },
      {
        id: 'video-platform',
        title: 'Video Platform',
        description: 'YouTube-like platform with video processing, streaming, and recommendation systems',
        category: 'Media',
        icon: '📺',
        features: ['Video Processing', 'Streaming', 'Recommendations', 'Content Moderation'],
        scale: 'Extremely High',
        complexity: 'Very High',
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Basic': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const getScaleColor = (scale) => {
    switch (scale) {
      case 'Low': return 'success';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Very High': return 'error';
      case 'Extremely High': return 'error';
      default: return 'default';
    }
  };

  const filteredProblems = () => {
    const tabProblems = selectedTab === 0 ? problems.basic : 
                       selectedTab === 1 ? problems.intermediate : problems.advanced;
    
    if (!searchQuery) return tabProblems;
    
    return tabProblems.filter(problem =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const tabLabels = ['Basic Level', 'Intermediate Level', 'Advanced Level'];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🚀 System Design Problems
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Master system design through hands-on problem solving
        </Typography>
      </Box>

      {/* Search and Tabs */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search problems by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ borderRadius: 2 }}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ '& .MuiTab-root': { py: 2 } }}
              >
                {tabLabels.map((label, index) => (
                  <Tab
                    key={index}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {index === 0 && <Code color="success" />}
                        {index === 1 && <TrendingUp color="warning" />}
                        {index === 2 && <School color="error" />}
                        {label}
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Problems Grid */}
      <Grid container spacing={4}>
        {filteredProblems().map((problem) => (
          <Grid item xs={12} md={6} lg={4} key={problem.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h2" sx={{ mr: 2 }}>
                    {problem.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {problem.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={tabLabels[selectedTab].split(' ')[0]}
                        color={getDifficultyColor(tabLabels[selectedTab].split(' ')[0])}
                        size="small"
                      />
                      <Chip label={problem.category} variant="outlined" size="small" />
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {problem.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {problem.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Scale: ${problem.scale}`}
                    color={getScaleColor(problem.scale)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Complexity: ${problem.complexity}`}
                    color={getDifficultyColor(problem.complexity)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  component={RouterLink}
                  to={`/problems/${problem.id}`}
                  size="small"
                  color="primary"
                  fullWidth
                >
                  Learn Design
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredProblems().length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No problems found matching your search criteria.
          </Typography>
          <Button
            onClick={() => setSearchQuery('')}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Problems;
