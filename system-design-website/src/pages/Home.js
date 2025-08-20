import React from 'react';
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
  Paper,
} from '@mui/material';
import {
  Code,
  School,
  Book,
  TrendingUp,
  Architecture,
  Speed,
  Security,
  Cloud,
} from '@mui/icons-material';

const Home = () => {
  const featuredProblems = [
    {
      id: 'twitter-clone',
      title: 'Twitter Clone',
      description: 'Social media platform with real-time feeds and interactions',
      difficulty: 'Intermediate',
      category: 'Social Media',
      icon: '🐦',
    },
    {
      id: 'chat-application',
      title: 'Chat Application',
      description: 'Real-time messaging with encryption and group chats',
      difficulty: 'Basic',
      category: 'Communication',
      icon: '💬',
    },
    {
      id: 'ecommerce-platform',
      title: 'E-commerce Platform',
      description: 'Amazon-like platform with inventory and payment systems',
      difficulty: 'Advanced',
      category: 'E-commerce',
      icon: '🛒',
    },
    {
      id: 'video-streaming',
      title: 'Video Streaming',
      description: 'YouTube-like platform with adaptive bitrate streaming',
      difficulty: 'Advanced',
      category: 'Media',
      icon: '🎥',
    },
  ];

  const features = [
    {
      icon: <Architecture />,
      title: 'Comprehensive Coverage',
      description: 'From basic URL shorteners to complex distributed systems',
    },
    {
      icon: <Speed />,
      title: 'Performance Focused',
      description: 'Learn optimization strategies and scaling techniques',
    },
    {
      icon: <Security />,
      title: 'Security First',
      description: 'Understand authentication, authorization, and data protection',
    },
    {
      icon: <Cloud />,
      title: 'Cloud Native',
      description: 'Design for modern cloud infrastructure and microservices',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🏗️ System Design Mastery
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Master the art of designing scalable, reliable, and efficient systems
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          From basic concepts to advanced distributed systems, this comprehensive guide covers everything you need 
          to ace system design interviews and build production-ready architectures.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/problems"
            variant="contained"
            size="large"
            startIcon={<Code />}
          >
            Explore Problems
          </Button>
          <Button
            component={RouterLink}
            to="/interview"
            variant="outlined"
            size="large"
            startIcon={<School />}
          >
            Interview Prep
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
          What You'll Learn
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', fontSize: 40 }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Problems Section */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
          Featured System Design Problems
        </Typography>
        <Grid container spacing={4}>
          {featuredProblems.map((problem) => (
            <Grid item xs={12} sm={6} md={6} key={problem.id}>
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
                      <Chip
                        label={problem.difficulty}
                        color={
                          problem.difficulty === 'Basic' ? 'success' :
                          problem.difficulty === 'Intermediate' ? 'warning' : 'error'
                        }
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Chip label={problem.category} variant="outlined" size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {problem.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    to={`/problems/${problem.id}`}
                    size="small"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Learning Path Section */}
      <Box sx={{ py: 6 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            🎯 Learning Path
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Start with fundamentals and progress to advanced concepts
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
            <Chip
              icon={<TrendingUp />}
              label="Basic Level"
              color="success"
              variant="outlined"
              sx={{ px: 2, py: 1 }}
            />
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              →
            </Typography>
            <Chip
              icon={<TrendingUp />}
              label="Intermediate Level"
              color="warning"
              variant="outlined"
              sx={{ px: 2, py: 1 }}
            />
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              →
            </Typography>
            <Chip
              icon={<TrendingUp />}
              label="Advanced Level"
              color="error"
              variant="outlined"
              sx={{ px: 2, py: 1 }}
            />
          </Box>
          <Button
            component={RouterLink}
            to="/problems"
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            startIcon={<Code />}
          >
            Start Learning
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
