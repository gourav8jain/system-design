import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const Interview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const interviewFramework = [
    {
      title: 'Requirements Gathering',
      description: 'Understand functional and non-functional requirements, clarify constraints and limitations',
      icon: '📋',
    },
    {
      title: 'Scale Estimation',
      description: 'Calculate traffic, storage, and bandwidth requirements based on user base',
      icon: '📊',
    },
    {
      title: 'High-Level Design',
      description: 'Draw system architecture and identify major components and service boundaries',
      icon: '🏗️',
    },
    {
      title: 'Detailed Design',
      description: 'Design database schema, APIs, and algorithms with failure scenarios',
      icon: '🔧',
    },
    {
      title: 'Deep Dive',
      description: 'Focus on one component and discuss optimization strategies',
      icon: '🔍',
    },
  ];

  const scaleEstimation = [
    {
      title: 'User Base Estimation',
      description: 'Estimate daily active users and growth patterns',
      example: '1K-10K (Small), 10K-1M (Medium), 1M-100M (Large), 100M+ (Massive)',
    },
    {
      title: 'Storage Requirements',
      description: 'Calculate data storage needs for users, content, and metadata',
      example: 'User profile: 1KB, Post: 1KB, Image: 1MB, Video: 100MB',
    },
    {
      title: 'Traffic Patterns',
      description: 'Understand read vs write ratios and peak traffic handling',
      example: 'Read-heavy: 80% reads, Write-heavy: 80% writes, Balanced: 50/50',
    },
  ];

  const commonPitfalls = [
    {
      title: 'Over-Engineering',
      description: 'Starting with microservices for small-scale systems instead of starting simple',
      impact: 'Complexity without benefits',
    },
    {
      title: 'Ignoring Non-Functional Requirements',
      description: 'Focusing only on features without considering scalability, availability, and security',
      impact: 'System fails under load',
    },
    {
      title: 'Not Estimating Scale',
      description: 'Designing without understanding the scale requirements and constraints',
      impact: 'Wrong technology choices',
    },
    {
      title: 'Poor Communication',
      description: 'Assuming interviewer knows your thoughts instead of explaining reasoning clearly',
      impact: 'Interviewer can\'t follow your design',
    },
  ];

  const proTips = [
    {
      title: 'Start Simple',
      description: 'Begin with a basic design and iterate based on requirements',
      benefit: 'Shows systematic thinking',
    },
    {
      title: 'Show Iteration',
      description: 'Demonstrate how you handle scaling from small to large systems',
      benefit: 'Proves scalability knowledge',
    },
    {
      title: 'Consider Edge Cases',
      description: 'Think about failure scenarios, data consistency, and error handling',
      benefit: 'Shows production readiness',
    },
    {
      title: 'Discuss Trade-offs',
      description: 'Every design decision has pros and cons - explain your reasoning',
      benefit: 'Demonstrates decision-making skills',
    },
  ];

  const interviewQuestions = [
    {
      category: 'Requirements',
      question: 'What are the functional and non-functional requirements?',
    },
    {
      category: 'Scale',
      question: 'How many users and what\'s the expected growth?',
    },
    {
      category: 'Architecture',
      question: 'What are the major components and how do they interact?',
    },
    {
      category: 'Database',
      question: 'What\'s the data model and how will you handle consistency?',
    },
    {
      category: 'Scalability',
      question: 'How will the system handle increased load?',
    },
    {
      category: 'Reliability',
      question: 'What happens when components fail?',
    },
  ];

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
          System Design Interview Prep
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
          Master the framework, strategies, and common pitfalls to ace your system design interviews.
        </Typography>
      </Box>

      {/* Interview Framework */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Interview Framework
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {interviewFramework.map((step, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                      fontSize: { xs: 32, sm: 36, md: 40 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {step.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 1.5, md: 2 }
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Scale Estimation Cheat Sheet */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Scale Estimation Cheat Sheet
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {scaleEstimation.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper sx={{ 
                p: { xs: 2, md: 3 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 1.5, md: 2 }
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
                <Box sx={{ mt: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="caption" 
                    color="primary.main"
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' }
                    }}
                  >
                    Example: {item.example}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Common Pitfalls */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Common Pitfalls to Avoid
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {commonPitfalls.map((pitfall, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'error.light',
                backgroundColor: 'error.light',
                '& .MuiCardContent-root': {
                  backgroundColor: 'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        mb: { xs: 1.5, md: 2 },
                        color: 'error.main'
                      }}
                    >
                      {pitfall.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {pitfall.description}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="caption" 
                      color="error.main"
                      sx={{ 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    >
                      Impact: {pitfall.impact}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pro Tips */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Pro Tips for Success
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {proTips.map((tip, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'success.light',
                backgroundColor: 'success.light',
                '& .MuiCardContent-root': {
                  backgroundColor: 'background.paper',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        mb: { xs: 1.5, md: 2 },
                        color: 'success.main'
                      }}
                    >
                      {tip.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {tip.description}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="caption" 
                      color="success.main"
                      sx={{ 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    >
                      Benefit: {tip.benefit}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Interview Questions Framework */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h2" 
          gutterBottom 
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, md: 6 },
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem' }
          }}
        >
          Interview Questions Framework
        </Typography>
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
            Use this framework to structure your responses:
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {interviewQuestions.map((question, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ 
                  p: { xs: 2, md: 2.5 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.default'
                }}>
                  <Typography 
                    variant="subtitle2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.main',
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {question.category}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {question.question}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Interview;
