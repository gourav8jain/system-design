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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Code,
  School,
  TrendingUp,
  Architecture,
  Speed,
  Security,
  Cloud,
} from '@mui/icons-material';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: { xs: 6, md: 10 } }}>
        <Typography 
          variant={isMobile ? "h2" : "h1"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' }
          }}
        >
          🏗️ System Design Mastery
        </Typography>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          color="text.secondary" 
          paragraph 
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            maxWidth: '90%',
            mx: 'auto'
          }}
        >
          Master the art of designing scalable, reliable, and efficient systems
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 800, 
            mx: 'auto', 
            mb: { xs: 4, md: 5 },
            px: { xs: 2, sm: 0 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.6
          }}
        >
          From basic concepts to advanced distributed systems, this comprehensive guide covers everything you need 
          to ace system design interviews and build production-ready architectures.
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 2, sm: 3 }, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          flexDirection: { xs: 'column', sm: 'row' },
          maxWidth: { xs: '100%', sm: 'auto' },
          mx: 'auto'
        }}>
          <Button
            component={RouterLink}
            to="/problems"
            variant="contained"
            size="large"
            startIcon={<Code />}
            fullWidth={isMobile}
            sx={{ 
              minWidth: { sm: '200px' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Explore Problems
          </Button>
          <Button
            component={RouterLink}
            to="/interview"
            variant="outlined"
            size="large"
            startIcon={<School />}
            fullWidth={isMobile}
            sx={{ 
              minWidth: { sm: '200px' },
              py: { xs: 1.5, sm: 2 },
              px: { xs: 3, sm: 4 },
              fontSize: { xs: '1rem', sm: '1.1rem' }
            }}
          >
            Interview Prep
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 5, md: 7 },
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          What You'll Learn
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                textAlign: 'center',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: { xs: 2, md: 3 },
                    color: 'primary.main'
                  }}>
                    <Box sx={{ 
                      fontSize: { xs: 36, sm: 40, md: 48 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      mb: { xs: 1.5, md: 2 }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Problems Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 5, md: 7 },
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Featured System Design Problems
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {featuredProblems.map((problem) => (
            <Grid item xs={12} sm={6} key={problem.id}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 3 } }}>
                    <Typography variant="h3" sx={{ mr: 2, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                      {problem.icon}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}
                      >
                        {problem.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          label={problem.difficulty}
                          size="small"
                          color={
                            problem.difficulty === 'Basic' ? 'success' :
                            problem.difficulty === 'Intermediate' ? 'warning' : 'error'
                          }
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        />
                        <Chip 
                          label={problem.category} 
                          variant="outlined" 
                          size="small"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
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
                </CardContent>
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={`/problems/${problem.id}`}
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Learning Path Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 5, md: 7 },
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', sm: '2.125rem' }
          }}
        >
          Learning Path
        </Typography>
        <Paper sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Start with Basics, Build Towards Mastery
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 2, sm: 4 },
            flexWrap: 'wrap'
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              opacity: 0.7
            }}>
              <Typography variant="body2" color="text.secondary">
                Basic Problems
              </Typography>
              {!isMobile && <Typography variant="body2" color="text.secondary">→</Typography>}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              opacity: 0.8
            }}>
              <Typography variant="body2" color="text.secondary">
                Intermediate Systems
              </Typography>
              {!isMobile && <Typography variant="body2" color="text.secondary">→</Typography>}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              opacity: 0.9
            }}>
              <Typography variant="body2" color="text.secondary">
                Advanced Architectures
              </Typography>
              {!isMobile && <Typography variant="body2" color="text.secondary">→</Typography>}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                Expert Level
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            <Button
              component={RouterLink}
              to="/problems"
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              sx={{ 
                py: { xs: 1.5, sm: 2 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              Start Learning
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home;
