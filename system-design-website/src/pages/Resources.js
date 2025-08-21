import React from 'react';
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
import { OpenInNew } from '@mui/icons-material';

const Resources = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const books = [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      description: 'The definitive guide to designing large-scale data systems',
      category: 'Data Systems',
      level: 'Advanced',
      rating: '5.0',
      topics: ['Distributed Systems', 'Data Modeling', 'Scalability', 'Consistency'],
      tags: ['Distributed Systems', 'Data Modeling', 'Scalability', 'Consistency'],
      link: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321',
    },
    {
      title: 'System Design Interview',
      author: 'Alex Xu',
      description: 'Comprehensive guide to system design interview questions',
      category: 'Interview Prep',
      level: 'Intermediate',
      rating: '4.8',
      topics: ['Interview Questions', 'Architecture Patterns', 'Scaling', 'Trade-offs'],
      tags: ['Interview Questions', 'Architecture Patterns', 'Scaling', 'Trade-offs'],
      link: 'https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119',
    },
    {
      title: 'Building Microservices',
      author: 'Sam Newman',
      description: 'Designing fine-grained systems for modern applications',
      category: 'Architecture',
      level: 'Intermediate',
      rating: '4.7',
      topics: ['Microservices', 'Service Design', 'Integration', 'Deployment'],
      tags: ['Microservices', 'Service Design', 'Integration', 'Deployment'],
      link: 'https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358',
    },
    {
      title: 'High Performance MySQL',
      author: 'Baron Schwartz',
      description: 'Optimization, backups, and replication strategies',
      category: 'Database',
      level: 'Advanced',
      rating: '4.6',
      topics: ['MySQL', 'Performance', 'Replication', 'Sharding'],
      tags: ['MySQL', 'Performance', 'Replication', 'Sharding'],
      link: 'https://www.amazon.com/High-Performance-MySQL-Optimization-Replication/dp/1449314287',
    },
  ];

  const tools = [
    {
      name: 'Draw.io',
      description: 'Free online diagram software for system architecture',
      category: 'Diagramming',
      url: 'https://draw.io',
      link: 'https://draw.io',
      features: ['Free', 'Collaborative', 'Templates', 'Export Options'],
      icon: '📊',
      categories: ['Free', 'Collaborative', 'Templates', 'Export Options'],
    },
    {
      name: 'Lucidchart',
      description: 'Professional diagramming tool with system design templates',
      category: 'Diagramming',
      url: 'https://lucidchart.com',
      link: 'https://lucidchart.com',
      features: ['Professional', 'Templates', 'Collaboration', 'Integration'],
      icon: '📈',
      categories: ['Professional', 'Templates', 'Collaboration', 'Integration'],
    },
    {
      name: 'AWS Architecture Icons',
      description: 'Official AWS icons for cloud architecture diagrams',
      category: 'Cloud',
      url: 'https://aws.amazon.com/architecture/icons/',
      link: 'https://aws.amazon.com/architecture/icons/',
      features: ['Official', 'Free', 'Comprehensive', 'Professional'],
      icon: '☁️',
      categories: ['Official', 'Free', 'Comprehensive', 'Professional'],
    },
    {
      name: 'Google Cloud Icons',
      description: 'Official Google Cloud icons for architecture diagrams',
      category: 'Cloud',
      url: 'https://cloud.google.com/icons',
      link: 'https://cloud.google.com/icons',
      features: ['Official', 'Free', 'Comprehensive', 'Professional'],
      icon: '☁️',
      categories: ['Official', 'Free', 'Comprehensive', 'Professional'],
    },
  ];

  const onlineResources = [
    {
      title: 'High Scalability',
      name: 'High Scalability',
      description: 'Real-world architecture case studies and lessons learned',
      url: 'http://highscalability.com',
      link: 'http://highscalability.com',
      category: 'Case Studies',
      features: ['Real Examples', 'Lessons Learned', 'Architecture Patterns', 'Performance Tips'],
      tags: ['Real Examples', 'Lessons Learned', 'Architecture Patterns', 'Performance Tips'],
    },
    {
      title: 'System Design Primer',
      name: 'System Design Primer',
      description: 'Open-source collection of system design topics and resources',
      url: 'https://github.com/donnemartin/system-design-primer',
      link: 'https://github.com/donnemartin/system-design-primer',
      category: 'Learning',
      features: ['Open Source', 'Comprehensive', 'Examples', 'Community'],
      tags: ['Open Source', 'Comprehensive', 'Examples', 'Community'],
    },
    {
      title: 'AWS Well-Architected Framework',
      name: 'AWS Well-Architected Framework',
      description: 'Best practices for designing and running cloud applications',
      url: 'https://aws.amazon.com/architecture/well-architected/',
      link: 'https://aws.amazon.com/architecture/well-architected/',
      category: 'Best Practices',
      features: ['Official', 'Best Practices', 'Checklists', 'Guidance'],
      tags: ['Official', 'Best Practices', 'Checklists', 'Guidance'],
    },
    {
      title: 'Google Cloud Architecture Framework',
      name: 'Google Cloud Architecture Framework',
      description: 'Google Cloud best practices and architectural guidance',
      url: 'https://cloud.google.com/architecture/framework',
      link: 'https://cloud.google.com/architecture/framework',
      category: 'Best Practices',
      features: ['Official', 'Best Practices', 'Patterns', 'Examples'],
      tags: ['Official', 'Best Practices', 'Patterns', 'Examples'],
    },
  ];

  const learningPaths = [
    {
      title: 'Fundamentals Path',
      duration: '4-6 weeks',
      description: 'Build a strong foundation in system design concepts',
      topics: [
        'System design basics and principles',
        'Scalability and performance concepts',
        'Database design and optimization',
        'Caching strategies and CDN',
      ],
      difficulty: 'Beginner',
    },
    {
      title: 'Intermediate Path',
      duration: '6-8 weeks',
      description: 'Master real-world system design patterns and architectures',
      topics: [
        'Microservices architecture',
        'Event-driven systems',
        'Load balancing and auto-scaling',
        'Security and authentication',
      ],
      difficulty: 'Intermediate',
    },
    {
      title: 'Advanced Path',
      duration: '8-12 weeks',
      description: 'Design complex, large-scale distributed systems',
      topics: [
        'Distributed systems and consistency',
        'Real-time processing and streaming',
        'Global scale considerations',
        'Advanced optimization techniques',
      ],
      difficulty: 'Advanced',
    },
  ];

  const practiceResources = [
    {
      title: 'LeetCode System Design',
      name: 'LeetCode System Design',
      description: 'Practice system design problems with detailed solutions',
      url: 'https://leetcode.com/explore/learn/card/system-design/',
      link: 'https://leetcode.com/explore/learn/card/system-design/',
      category: 'Practice',
      features: ['Problems', 'Solutions', 'Discussion', 'Progress Tracking'],
      tags: ['Problems', 'Solutions', 'Discussion', 'Progress Tracking'],
      icon: '💻',
      type: 'Practice Platform',
    },
    {
      title: 'Grokking the System Design Interview',
      name: 'Grokking the System Design Interview',
      description: 'Interactive course with real interview questions',
      url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
      link: 'https://www.educative.io/courses/grokking-the-system-design-interview',
      category: 'Course',
      features: ['Interactive', 'Real Questions', 'Step-by-step', 'Practice'],
      tags: ['Interactive', 'Real Questions', 'Step-by-step', 'Practice'],
      icon: '📚',
      type: 'Online Course',
    },
    {
      title: 'System Design Interview Course',
      name: 'System Design Interview Course',
      description: 'Comprehensive course covering all aspects of system design',
      url: 'https://interviewing.io/courses/system-design',
      link: 'https://interviewing.io/courses/system-design',
      category: 'Course',
      features: ['Comprehensive', 'Video Content', 'Practice', 'Feedback'],
      tags: ['Comprehensive', 'Video Content', 'Practice', 'Feedback'],
      icon: '🎓',
      type: 'Video Course',
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
          Learning Resources
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
          Curated resources to accelerate your system design learning journey. From essential books to practical tools and platforms.
        </Typography>
      </Box>

      {/* Essential Books */}
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
          Essential Books
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {books.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    {book.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {book.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: { xs: 2, md: 3 } }}>
                    {book.tags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<OpenInNew />}
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tools and Platforms */}
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
          Tools and Platforms
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: { xs: 2, md: 3 },
                    color: 'primary.main'
                  }}>
                    <Box sx={{ 
                      fontSize: { xs: 32, sm: 36, md: 40 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      {tool.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }}
                    >
                      {tool.name}
                    </Typography>
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
                    {tool.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {tool.categories.map((category, catIndex) => (
                      <Chip
                        key={catIndex}
                        label={category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<OpenInNew />}
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    Visit Tool
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Learning Paths */}
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
          Learning Paths
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {learningPaths.map((path, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper sx={{ 
                p: { xs: 3, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid',
                borderColor: 'primary.light',
                backgroundColor: 'primary.light',
                '& .MuiBox-root': {
                  backgroundColor: 'background.paper',
                  height: '100%',
                  p: { xs: 2, md: 3 },
                  borderRadius: 1
                }
              }}>
                <Box>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      mb: { xs: 1.5, md: 2 },
                      color: 'primary.main'
                    }}
                  >
                    {path.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {path.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {path.topics.map((topic, topicIndex) => (
                      <Chip
                        key={topicIndex}
                        label={topic}
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
                    Duration: {path.duration}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Online Resources */}
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
          Online Resources
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {onlineResources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    {resource.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: { xs: 2, md: 3 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.5
                    }}
                  >
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {resource.tags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<OpenInNew />}
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    Visit Resource
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Practice Platforms */}
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
          Practice Platforms
        </Typography>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {practiceResources.map((resource, index) => (
            <Grid item xs={12} sm={6} key={index}>
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
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: { xs: 2, md: 3 }
                  }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mr: 2,
                        fontSize: { xs: '2rem', sm: '2.5rem' }
                      }}
                    >
                      {resource.icon}
                    </Typography>
                    <Box>
                      <Typography 
                        variant="h6" 
                        component="h3"
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1rem', sm: '1.1rem' }
                        }}
                      >
                        {resource.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' }
                        }}
                      >
                        {resource.type}
                      </Typography>
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
                    {resource.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {resource.features.map((feature, featureIndex) => (
                      <Chip
                        key={featureIndex}
                        label={feature}
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
                </CardContent>
                <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Button
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    startIcon={<OpenInNew />}
                    fullWidth
                    sx={{ 
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 'bold'
                    }}
                  >
                    Start Practicing
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Resources;
