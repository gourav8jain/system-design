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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search, Code, TrendingUp, School } from '@mui/icons-material';

const Problems = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const getFilteredProblems = () => {
    const tabProblems = selectedTab === 0 ? problems.basic : 
                       selectedTab === 1 ? problems.intermediate : problems.advanced;
    
    if (!searchQuery) return tabProblems;
    
    return tabProblems.filter(problem =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, md: 4 },
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          System Design Problems
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 5 },
            maxWidth: 800,
            mx: 'auto',
            px: { xs: 2, sm: 0 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.6
          }}
        >
          Master system design through hands-on problems. Start with basic concepts and progress to advanced distributed systems.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: { xs: 4, md: 5 } }}>
          <TextField
            fullWidth
            placeholder="Search problems by title, category, or difficulty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* Difficulty Tabs */}
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
            <Tab 
              label={isMobile ? "Basic" : "Basic Problems"} 
              icon={<School />} 
              iconPosition="start"
            />
            <Tab 
              label={isMobile ? "Intermediate" : "Intermediate Problems"} 
              icon={<Code />} 
              iconPosition="start"
            />
            <Tab 
              label={isMobile ? "Advanced" : "Advanced Problems"} 
              icon={<TrendingUp />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Problems Grid */}
      <Box sx={{ pb: { xs: 6, md: 8 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {getFilteredProblems().map((problem) => (
            <Grid item xs={12} sm={6} lg={4} key={problem.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mr: { xs: 1.5, sm: 2 }, 
                        fontSize: { xs: '2rem', sm: '2.5rem' },
                        flexShrink: 0
                      }}
                    >
                      {problem.icon}
                    </Typography>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          mb: { xs: 1, md: 1.5 }
                        }}
                      >
                        {problem.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: { xs: 1.5, md: 2 } }}>
                        <Chip
                          label={problem.category}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                        <Chip
                          label={`Scale: ${problem.scale}`}
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                        <Chip
                          label={`Complexity: ${problem.complexity}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            height: { xs: 20, sm: 24 }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {problem.description}
                  </Typography>

                  {/* Features */}
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        mb: 1,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    >
                      Key Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {problem.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 18, sm: 20 },
                            '& .MuiChip-label': {
                              px: { xs: 1, sm: 1.5 }
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={`/problems/${problem.id}`}
                    variant="contained"
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results Message */}
        {getFilteredProblems().length === 0 && (
          <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              No problems found matching your search.
            </Typography>
            <Button
              onClick={() => setSearchQuery('')}
              variant="outlined"
              sx={{ 
                py: { xs: 1, sm: 1.5 },
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Clear Search
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Problems;
