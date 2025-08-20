import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const Interview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const interviewFramework = [
    {
      step: '1. Requirements Gathering',
      duration: '5-10 minutes',
      description: 'Understand functional and non-functional requirements',
      activities: [
        'Clarify functional requirements',
        'Identify non-functional requirements',
        'Ask clarifying questions about scale',
        'Understand constraints and limitations',
      ],
    },
    {
      step: '2. Scale Estimation',
      duration: '5-10 minutes',
      description: 'Calculate traffic, storage, and bandwidth requirements',
      activities: [
        'Estimate daily active users (DAU)',
        'Calculate requests per second (RPS)',
        'Estimate storage requirements',
        'Determine bandwidth needs',
      ],
    },
    {
      step: '3. High-Level Design',
      duration: '10-15 minutes',
      description: 'Draw system architecture and identify major components',
      activities: [
        'Draw system architecture diagram',
        'Identify major components',
        'Define service boundaries',
        'Consider load balancing and caching',
      ],
    },
    {
      step: '4. Detailed Design',
      duration: '15-20 minutes',
      description: 'Design database schema, APIs, and algorithms',
      activities: [
        'Design database schema',
        'Define API contracts',
        'Consider data consistency',
        'Plan for failure scenarios',
      ],
    },
    {
      step: '5. Deep Dive',
      duration: '10-15 minutes',
      description: 'Focus on one component and discuss optimization',
      activities: [
        'Focus on one component in detail',
        'Discuss algorithms and data structures',
        'Consider optimization strategies',
        'Address scalability concerns',
      ],
    },
  ];

  const commonPitfalls = [
    {
      title: 'Over-Engineering',
      description: 'Starting with microservices for small-scale systems',
      solution: 'Start simple and scale when needed',
      icon: <Warning color="warning" />,
    },
    {
      title: 'Ignoring Non-Functional Requirements',
      description: 'Focusing only on features without considering scalability',
      solution: 'Always consider scalability, availability, and security',
      icon: <Warning color="warning" />,
    },
    {
      title: 'Not Estimating Scale',
      description: 'Designing without understanding the scale requirements',
      solution: 'Always estimate users, data, and traffic',
      icon: <Warning color="warning" />,
    },
    {
      title: 'Poor Communication',
      description: 'Assuming interviewer knows your thoughts',
      solution: 'Explain your reasoning clearly and think aloud',
      icon: <Warning color="warning" />,
    },
  ];

  const proTips = [
    {
      title: 'Start Simple',
      description: 'Begin with a basic design and iterate',
      example: '"Let me start with a simple design and then optimize..."',
    },
    {
      title: 'Show Iteration',
      description: 'Demonstrate how you handle scaling',
      example: '"First, let\'s handle 1M users, then scale to 100M..."',
    },
    {
      title: 'Consider Edge Cases',
      description: 'Think about failure scenarios and data consistency',
      example: '"What happens if the database goes down?"',
    },
    {
      title: 'Discuss Trade-offs',
      description: 'Every design decision has pros and cons',
      example: '"Using Redis improves performance but adds complexity..."',
    },
  ];

  const scaleEstimation = {
    userBase: [
      { range: '1K - 10K', level: 'Small', color: 'success' },
      { range: '10K - 1M', level: 'Medium', color: 'info' },
      { range: '1M - 100M', level: 'Large', color: 'warning' },
      { range: '100M+', level: 'Massive', color: 'error' },
    ],
    storage: [
      { item: 'User profile', size: '1KB' },
      { item: 'Post/Message', size: '1KB' },
      { item: 'Image', size: '1MB' },
      { item: 'Video', size: '100MB' },
      { item: 'Database index', size: '10% of data' },
    ],
    traffic: [
      { type: 'Read-heavy', ratio: '80% reads, 20% writes' },
      { type: 'Write-heavy', ratio: '20% reads, 80% writes' },
      { type: 'Balanced', ratio: '50% reads, 50% writes' },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h3" : "h2"} 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          🎯 System Design Interview Prep
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.secondary" 
          paragraph
        >
          Master the framework, avoid common pitfalls, and ace your interviews
        </Typography>
      </Box>

      {/* Interview Framework */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}
        >
          📋 Interview Framework
        </Typography>
        <Grid container spacing={3}>
          {interviewFramework.map((step, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={step.step}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {step.step}
                  </Typography>
                  <Chip
                    label={step.duration}
                    color="secondary"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {step.description}
                  </Typography>
                  <List dense>
                    {step.activities.map((activity, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={activity} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Scale Estimation Cheat Sheet */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}
        >
          📊 Scale Estimation Cheat Sheet
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  User Base Estimation
                </Typography>
                {scaleEstimation.userBase.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Chip
                      label={`${item.range} users`}
                      color={item.color}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" component="span">
                      {item.level}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Storage Estimation
                </Typography>
                {scaleEstimation.storage.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                      {item.item}:
                    </Typography>
                    <Chip
                      label={item.size}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Traffic Patterns
                </Typography>
                {scaleEstimation.traffic.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                      {item.type}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {item.ratio}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Common Pitfalls */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}
        >
          ⚠️ Common Pitfalls to Avoid
        </Typography>
        <Grid container spacing={3}>
          {commonPitfalls.map((pitfall, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {pitfall.icon}
                    <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                      {pitfall.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {pitfall.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Solution: {pitfall.solution}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pro Tips */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}
        >
          💡 Pro Tips
        </Typography>
        <Grid container spacing={3}>
          {proTips.map((tip, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom color="primary">
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tip.description}
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      "{tip.example}"
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Success Formula */}
      <Box sx={{ textAlign: 'center', py: { xs: 3, md: 4 } }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom>
            🎉 Success Formula
          </Typography>
          <Typography variant={isMobile ? "body1" : "h6"} paragraph>
            Preparation + Practice + Communication = Success
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            flexWrap: 'wrap', 
            mt: 3,
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Chip label="Study the fundamentals" color="inherit" variant="outlined" />
            <Chip label="Practice common problems" color="inherit" variant="outlined" />
            <Chip label="Communicate clearly" color="inherit" variant="outlined" />
            <Chip label="Iterate and improve" color="inherit" variant="outlined" />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Interview;
