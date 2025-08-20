# 🏗️ System Design Website

A comprehensive React-based website covering all system design problems, solutions, tips, and strategies for technical interviews and real-world applications.

## 🚀 Features

### 📚 **Comprehensive Coverage**
- **15+ System Design Problems** from basic to advanced levels
- **Interview Preparation** with frameworks and strategies
- **Learning Resources** including books, tools, and online materials
- **Interactive Problem Details** with architecture diagrams and solutions

### 🎯 **Problem Categories**
- **Basic Level**: URL Shortener, Rate Limiter, Chat Application
- **Intermediate Level**: Twitter Clone, Notification System, Payment System, Video Streaming, Instagram
- **Advanced Level**: Messaging Platform, E-commerce Platform, Ride-Sharing, Search Engine, Video Platform

### 🛠️ **Technical Features**
- **Responsive Design** with Material-UI components
- **Modern React** with hooks and functional components
- **Client-side Routing** for seamless navigation
- **Interactive Components** including tabs, accordions, and cards
- **Search and Filtering** capabilities
- **Mobile-First** design approach

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd system-design-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.js       # Navigation component
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Problems.js     # Problems listing page
│   ├── ProblemDetail.js # Individual problem detail page
│   ├── Interview.js    # Interview preparation page
│   └── Resources.js    # Learning resources page
├── App.js              # Main app component with routing
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Design System

### **Material-UI Theme**
- **Primary Color**: Blue (#1976d2)
- **Secondary Color**: Pink (#dc004e)
- **Background**: Light gray (#f5f5f5)
- **Typography**: Roboto font family

### **Component Library**
- **Cards**: Information display and organization
- **Chips**: Status indicators and tags
- **Tabs**: Content organization
- **Accordions**: Expandable content sections
- **Grid System**: Responsive layout management

## 📱 Responsive Design

The website is designed to work seamlessly across all device sizes:

- **Desktop**: Full-featured experience with side-by-side layouts
- **Tablet**: Optimized layouts for medium screens
- **Mobile**: Mobile-first design with collapsible navigation

## 🔧 Customization

### **Adding New Problems**
1. Add problem data to the `problemData` object in `ProblemDetail.js`
2. Include all required fields: title, description, requirements, architecture, etc.
3. Update the problems list in `Problems.js`

### **Modifying the Theme**
1. Edit the theme configuration in `App.js`
2. Update color schemes, typography, and spacing
3. Modify global styles in `index.css`

### **Adding New Pages**
1. Create a new page component in the `pages/` directory
2. Add the route to `App.js`
3. Update navigation in `Navbar.js`

## 📚 Content Structure

### **Problem Details Include**
- **Overview**: Requirements and scale estimation
- **Architecture**: System components and diagrams
- **Database**: Schema design and optimization
- **Optimization**: Caching and scaling strategies
- **Security**: Security considerations and best practices

### **Interview Preparation Covers**
- **Framework**: 5-step interview process
- **Scale Estimation**: Cheat sheets and formulas
- **Common Pitfalls**: What to avoid
- **Pro Tips**: Expert advice and examples
- **Detailed Strategies**: Time management and communication

### **Resources Section Features**
- **Essential Books**: Curated reading list
- **Tools**: Diagramming and architecture tools
- **Learning Paths**: Structured learning approaches
- **Online Resources**: Websites and frameworks
- **Practice Resources**: Hands-on learning materials

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Static Hosting**
The build folder contains static files that can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3**
- **Any static hosting service**

### **Environment Variables**
Create a `.env` file for environment-specific configurations:
```env
REACT_APP_API_URL=your-api-url
REACT_APP_ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

### **How to Contribute**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Development Guidelines**
- Follow React best practices
- Use functional components with hooks
- Maintain consistent code style
- Add proper documentation
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Material-UI** for the component library
- **React Router** for navigation
- **System Design Community** for content inspiration
- **Open Source Contributors** for various tools and resources

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and examples

---

**Happy System Designing! 🚀**

*Built with ❤️ using React and Material-UI*
