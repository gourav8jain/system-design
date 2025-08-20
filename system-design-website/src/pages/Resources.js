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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
} from '@mui/material';
import {
  Book,
  School,
  Code,
  Cloud,
  Security,
  Speed,
  Architecture,
  TrendingUp,
  CheckCircle,
  OpenInNew,
} from '@mui/icons-material';

const Resources = () => {
  const books = [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      description: 'The definitive guide to designing large-scale data systems',
      category: 'Data Systems',
      level: 'Advanced',
      rating: '5.0',
      topics: ['Distributed Systems', 'Data Modeling', 'Scalability', 'Consistency'],
    },
    {
      title: 'System Design Interview',
      author: 'Alex Xu',
      description: 'Comprehensive guide to system design interview questions',
      category: 'Interview Prep',
      level: 'Intermediate',
      rating: '4.8',
      topics: ['Interview Questions', 'Architecture Patterns', 'Scaling', 'Trade-offs'],
    },
    {
      title: 'Building Microservices',
      author: 'Sam Newman',
      description: 'Designing fine-grained systems for modern applications',
      category: 'Architecture',
      level: 'Intermediate',
      rating: '4.7',
      topics: ['Microservices', 'Service Design', 'Integration', 'Deployment'],
    },
    {
      title: 'High Performance MySQL',
      author: 'Baron Schwartz',
      description: 'Optimization, backups, and replication strategies',
      category: 'Database',
      level: 'Advanced',
      rating: '4.6',
      topics: ['MySQL', 'Performance', 'Replication', 'Sharding'],
    },
  ];

  const tools = [
    {
      name: 'Draw.io',
      description: 'Free online diagram software for system architecture',
      category: 'Diagramming',
      url: 'https://draw.io',
      features: ['Free', 'Collaborative', 'Templates', 'Export Options'],
    },
    {
      name: 'Lucidchart',
      description: 'Professional diagramming tool with system design templates',
      category: 'Diagramming',
      url: 'https://lucidchart.com',
      features: ['Professional', 'Templates', 'Collaboration', 'Integration'],
    },
    {
      name: 'AWS Architecture Icons',
      description: 'Official AWS icons for cloud architecture diagrams',
      category: 'Cloud',
      url: 'https://aws.amazon.com/architecture/icons/',
      features: ['Official', 'Free', 'Comprehensive', 'Professional'],
    },
    {
      name: 'Google Cloud Icons',
      description: 'Official Google Cloud icons for architecture diagrams',
      category: 'Cloud',
      url: 'https://cloud.google.com/icons',
      features: ['Official', 'Free', 'Comprehensive', 'Professional'],
    },
  ];

  const onlineResources = [
    {
      title: 'High Scalability',
      description: 'Real-world architecture case studies and lessons learned',
      url: 'http://highscalability.com',
      category: 'Case Studies',
      features: ['Real Examples', 'Lessons Learned', 'Architecture Patterns', 'Performance Tips'],
    },
    {
      title: 'System Design Primer',
      description: 'Open-source collection of system design topics and resources',
      url: 'https://github.com/donnemartin/system-design-primer',
      category: 'Learning',
      features: ['Open Source', 'Comprehensive', 'Examples', 'Community'],
    },
    {
      title: 'AWS Well-Architected Framework',
      description: 'Best practices for designing and running cloud applications',
      url: 'https://aws.amazon.com/architecture/well-architected/',
      category: 'Best Practices',
      features: ['Official', 'Best Practices', 'Checklists', 'Guidance'],
    },
    {
      title: 'Google Cloud Architecture Framework',
      description: 'Google Cloud best practices and architectural guidance',
      url: 'https://cloud.google.com/architecture/framework',
      category: 'Best Practices',
      features: ['Official', 'Best Practices', 'Patterns', 'Examples'],
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
      description: 'Practice system design problems with detailed solutions',
      url: 'https://leetcode.com/explore/learn/card/system-design/',
      category: 'Practice',
      features: ['Problems', 'Solutions', 'Discussion', 'Progress Tracking'],
    },
    {
      title: 'Grokking the System Design Interview',
      description: 'Interactive course with real interview questions',
      url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
      category: 'Course',
      features: ['Interactive', 'Real Questions', 'Step-by-step', 'Practice'],
    },
    {
      title: 'System Design Interview Course',
      description: 'Comprehensive course covering all aspects of system design',
      url: 'https://interviewing.io/courses/system-design',
      category: 'Course',
      features: ['Comprehensive', 'Video Content', 'Practice', 'Feedback'],
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          📚 Learning Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Books, tools, and resources to accelerate your system design journey
        </Typography>
      </Box>

      {/* Books Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          📖 Essential Books
        </Typography>
        <Grid container spacing={4}>
          {books.map((book, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Book color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {book.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {book.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={book.category}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={book.level}
                        color={
                          book.level === 'Beginner' ? 'success' :
                          book.level === 'Intermediate' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                      <Chip
                        label={`⭐ ${book.rating}`}
                        color="secondary"
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Key Topics:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {book.topics.map((topic, idx) => (
                      <Chip
                        key={idx}
                        label={topic}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tools Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          🛠️ Essential Tools
        </Typography>
        <Grid container spacing={4}>
          {tools.map((tool, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {tool.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tool.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={tool.category}
                      color="secondary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {tool.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                    size="small"
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
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          🎯 Learning Paths
        </Typography>
        <Grid container spacing={4}>
          {learningPaths.map((path, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <School color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {path.title}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={path.duration}
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={path.difficulty}
                      color={
                        path.difficulty === 'Beginner' ? 'success' :
                        path.difficulty === 'Intermediate' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {path.description}
                  </Typography>

                  <Typography variant="subtitle2" gutterBottom>
                    Topics Covered:
                  </Typography>
                  <List dense>
                    {path.topics.map((topic, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={topic} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Online Resources */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          🌐 Online Resources
        </Typography>
        <Grid container spacing={4}>
          {onlineResources.map((resource, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={resource.category}
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Key Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {resource.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                    size="small"
                  >
                    Visit Resource
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Practice Resources */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          🎯 Practice Resources
        </Typography>
        <Grid container spacing={4}>
          {practiceResources.map((resource, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={resource.category}
                      color="secondary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {resource.features.map((feature, idx) => (
                      <Chip
                        key={idx}
                        label={feature}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                    size="small"
                    fullWidth
                  >
                    Start Practicing
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: 'secondary.main', color: 'white' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            🚀 Ready to Master System Design?
          </Typography>
          <Typography variant="h6" paragraph>
            Start with the fundamentals and build your way up to complex distributed systems
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
            <Chip label="Study the books" color="inherit" variant="outlined" />
            <Chip label="Use the tools" color="inherit" variant="outlined" />
            <Chip label="Follow the paths" color="inherit" variant="outlined" />
            <Chip label="Practice regularly" color="inherit" variant="outlined" />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Resources;
