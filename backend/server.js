require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// CORS Configuration - Allow development origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development mode, allow any origin to make network testing seamless
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:5001',
      'http://localhost:5002',
      'http://localhost:5003',
      'http://localhost:3000',
      'http://127.0.0.1:5001',
      'http://127.0.0.1:5002',
      'http://127.0.0.1:5003',
      'http://127.0.0.1:3000',
      'https://react-portfolio-full.pages.dev',
      'https://port-wp7o.onrender.com'
    ];
    
    const isLocalIp = /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);

    if (allowedOrigins.indexOf(origin) !== -1 || isLocalIp) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend build (for production)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Get local IP
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIp = 'localhost';
Object.keys(networkInterfaces).forEach(interfaceName => {
  networkInterfaces[interfaceName].forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIp = iface.address;
    }
  });
});

// ============ INITIAL DATA WITH DEFAULT VALUES ============
let portfolioData = {
  profile: {
    name: 'Rahul Mahato',
    title: 'Full Stack Developer',
    bio: 'I am a passionate Full Stack Developer with expertise in MERN stack. I love creating beautiful and functional web applications.',
    email: 'rm91275@gmail.com',
    phone: '+977 98XXXXXXXX',
    address: 'Kathmandu, Nepal',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    image: '',
    cv: ''
  },
  about: {
    mainText: 'Full Stack Developer & UI/UX Enthusiast',
    paragraphs: [
      'I am a Computer Science student with a passion for web development. I love building applications that solve real-world problems.',
      'My journey in technology started with curiosity about how websites work. Since then, I have worked on numerous projects using modern technologies.',
      'When I am not coding, you can find me exploring new technologies, contributing to open source, or mentoring fellow developers.'
    ]
  },
  services: [
    { id: 1, icon: 'bx bx-code-alt', title: 'Web Development', description: 'Building responsive and modern websites using React, Node.js, and MongoDB.' },
    { id: 2, icon: 'bx bx-mobile-alt', title: 'Mobile App Development', description: 'Creating cross-platform mobile applications using React Native.' },
    { id: 3, icon: 'bx bx-paint', title: 'UI/UX Design', description: 'Designing beautiful and intuitive user interfaces.' }
  ],
  technicalSkills: [
    { id: 1, name: 'HTML5', level: 90, icon: 'bx bxl-html5' },
    { id: 2, name: 'CSS3', level: 85, icon: 'bx bxl-css3' },
    { id: 3, name: 'JavaScript', level: 88, icon: 'bx bxl-javascript' },
    { id: 4, name: 'React', level: 85, icon: 'bx bxl-react' },
    { id: 5, name: 'Node.js', level: 80, icon: 'bx bxl-nodejs' },
    { id: 6, name: 'MongoDB', level: 75, icon: 'bx bxl-mongodb' }
  ],
  professionalSkills: [
    { id: 1, name: 'Problem Solving', level: 90 },
    { id: 2, name: 'Communication', level: 85 },
    { id: 3, name: 'Team Work', level: 88 },
    { id: 4, name: 'Time Management', level: 82 }
  ],
  projects: [
    { id: 1, title: 'E-Commerce Platform', description: 'Full-featured e-commerce platform with cart, payment, and admin panel.', technologies: ['React', 'Node.js', 'MongoDB'], image: '', liveLink: '', githubLink: '' },
    { id: 2, title: 'Task Management App', description: 'Collaborative task management application with real-time updates.', technologies: ['React', 'Socket.io', 'Express'], image: '', liveLink: '', githubLink: '' },
    { id: 3, title: 'Portfolio CMS', description: 'Content Management System for portfolios.', technologies: ['React', 'Node.js', 'MongoDB'], image: '', liveLink: '', githubLink: '' }
  ],
  teamwork: [
    { id: 1, title: 'Hackathon Winner', description: 'Won first place at college hackathon.', role: 'Team Lead', image: '' },
    { id: 2, title: 'Open Source Contributor', description: 'Contributed to various open source projects.', role: 'Contributor', image: '' }
  ]
};

let contactMessages = [];
let visitors = [];

// JWT Secret
const JWT_SECRET = 'your-super-secret-key-2024';

// ============ ROUTES ============

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio CMS API is running!',
    server: {
      local: `http://localhost:${process.env.PORT || 5002}`,
      network: `http://${localIp}:${process.env.PORT || 5002}`
    },
    endpoints: {
      health: 'GET /health',
      login: 'POST /api/auth/login',
      portfolio: 'GET /api/portfolio',
      allEndpoints: 'GET /api/endpoints'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), port: PORT || 5002 });
});

// List all endpoints
app.get('/api/endpoints', (req, res) => {
  res.json({
    auth: {
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me'
    },
    portfolio: {
      getAll: 'GET /api/portfolio',
      getProfile: 'GET /api/portfolio/profile',
      updateProfile: 'PUT /api/portfolio/profile',
      updateAbout: 'PUT /api/portfolio/about',
      services: 'GET/POST/PUT/DELETE /api/portfolio/services',
      technicalSkills: 'GET/POST/PUT/DELETE /api/portfolio/technical-skills',
      professionalSkills: 'GET/POST/PUT/DELETE /api/portfolio/professional-skills',
      projects: 'GET/POST/PUT/DELETE /api/portfolio/projects',
      teamwork: 'GET/POST/PUT/DELETE /api/portfolio/teamwork'
    },
    contact: {
      send: 'POST /api/contact',
      getAll: 'GET /api/contact'
    },
    visitor: {
      track: 'POST /api/visitor',
      stats: 'GET /api/visitor/stats'
    }
  });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/login', (req, res) => {
  console.log('📝 Login attempt:', req.body.email);
  const { email, password } = req.body;
  
  if (email === 'rm91275@gmail.com' && password === 'Admin@123') {
    const token = jwt.sign({ email, id: 1 }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      token,
      user: { id: 1, name: 'Rahul Mahato', email: email, role: 'admin' }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. Use rm91275@gmail.com / Admin@123'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      success: true,
      user: { id: 1, name: 'Rahul Mahato', email: decoded.email, role: 'admin' }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ============ PORTFOLIO ROUTES ============

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json({ success: true, data: portfolioData });
});

// Get profile
app.get('/api/portfolio/profile', (req, res) => {
  res.json({ success: true, data: portfolioData.profile });
});

// Update profile
app.put('/api/portfolio/profile', (req, res) => {
  portfolioData.profile = { ...portfolioData.profile, ...req.body };
  console.log('Profile updated:', portfolioData.profile.name);
  res.json({ success: true, data: portfolioData.profile });
});

// Update about
app.put('/api/portfolio/about', (req, res) => {
  portfolioData.about = { ...portfolioData.about, ...req.body };
  console.log('About updated');
  res.json({ success: true, data: portfolioData.about });
});

// Get all services
app.get('/api/portfolio/services', (req, res) => {
  res.json({ success: true, data: portfolioData.services });
});

// Add service
app.post('/api/portfolio/services', (req, res) => {
  const newService = { id: Date.now(), ...req.body };
  portfolioData.services.push(newService);
  console.log('Service added:', newService.title);
  res.json({ success: true, data: newService });
});

// Update service
app.put('/api/portfolio/services/:id', (req, res) => {
  const index = portfolioData.services.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.services[index] = { ...portfolioData.services[index], ...req.body };
    res.json({ success: true, data: portfolioData.services[index] });
  } else {
    res.status(404).json({ success: false, message: 'Service not found' });
  }
});

// Delete service
app.delete('/api/portfolio/services/:id', (req, res) => {
  portfolioData.services = portfolioData.services.filter(s => s.id != req.params.id);
  res.json({ success: true, message: 'Service deleted' });
});

// Get technical skills
app.get('/api/portfolio/technical-skills', (req, res) => {
  res.json({ success: true, data: portfolioData.technicalSkills });
});

// Add technical skill
app.post('/api/portfolio/technical-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.technicalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

// Update technical skill
app.put('/api/portfolio/technical-skills/:id', (req, res) => {
  const index = portfolioData.technicalSkills.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.technicalSkills[index] = { ...portfolioData.technicalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.technicalSkills[index] });
  } else {
    res.status(404).json({ success: false, message: 'Skill not found' });
  }
});

// Delete technical skill
app.delete('/api/portfolio/technical-skills/:id', (req, res) => {
  portfolioData.technicalSkills = portfolioData.technicalSkills.filter(s => s.id != req.params.id);
  res.json({ success: true, message: 'Skill deleted' });
});

// Get professional skills
app.get('/api/portfolio/professional-skills', (req, res) => {
  res.json({ success: true, data: portfolioData.professionalSkills });
});

// Add professional skill
app.post('/api/portfolio/professional-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.professionalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

// Update professional skill
app.put('/api/portfolio/professional-skills/:id', (req, res) => {
  const index = portfolioData.professionalSkills.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.professionalSkills[index] = { ...portfolioData.professionalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.professionalSkills[index] });
  } else {
    res.status(404).json({ success: false, message: 'Skill not found' });
  }
});

// Delete professional skill
app.delete('/api/portfolio/professional-skills/:id', (req, res) => {
  portfolioData.professionalSkills = portfolioData.professionalSkills.filter(s => s.id != req.params.id);
  res.json({ success: true, message: 'Skill deleted' });
});

// Get projects
app.get('/api/portfolio/projects', (req, res) => {
  res.json({ success: true, data: portfolioData.projects });
});

// Add project
app.post('/api/portfolio/projects', (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  portfolioData.projects.push(newProject);
  res.json({ success: true, data: newProject });
});

// Update project
app.put('/api/portfolio/projects/:id', (req, res) => {
  const index = portfolioData.projects.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    portfolioData.projects[index] = { ...portfolioData.projects[index], ...req.body };
    res.json({ success: true, data: portfolioData.projects[index] });
  } else {
    res.status(404).json({ success: false, message: 'Project not found' });
  }
});

// Delete project
app.delete('/api/portfolio/projects/:id', (req, res) => {
  portfolioData.projects = portfolioData.projects.filter(p => p.id != req.params.id);
  res.json({ success: true, message: 'Project deleted' });
});

// Get teamwork
app.get('/api/portfolio/teamwork', (req, res) => {
  res.json({ success: true, data: portfolioData.teamwork });
});

// Add teamwork
app.post('/api/portfolio/teamwork', (req, res) => {
  const newTeamwork = { id: Date.now(), ...req.body };
  portfolioData.teamwork.push(newTeamwork);
  res.json({ success: true, data: newTeamwork });
});

// Update teamwork
app.put('/api/portfolio/teamwork/:id', (req, res) => {
  const index = portfolioData.teamwork.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    portfolioData.teamwork[index] = { ...portfolioData.teamwork[index], ...req.body };
    res.json({ success: true, data: portfolioData.teamwork[index] });
  } else {
    res.status(404).json({ success: false, message: 'Teamwork not found' });
  }
});

// Delete teamwork
app.delete('/api/portfolio/teamwork/:id', (req, res) => {
  portfolioData.teamwork = portfolioData.teamwork.filter(t => t.id != req.params.id);
  res.json({ success: true, message: 'Teamwork deleted' });
});

// ============ CONTACT ROUTES ============
app.post('/api/contact', (req, res) => {
  const newMessage = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date(),
    isRead: false
  };
  contactMessages.push(newMessage);
  console.log('New contact message from:', req.body.name);
  res.json({ success: true, message: 'Message sent successfully' });
});

app.get('/api/contact', (req, res) => {
  res.json({ success: true, data: contactMessages });
});

app.put('/api/contact/:id/read', (req, res) => {
  const message = contactMessages.find(m => m.id == req.params.id);
  if (message) {
    message.isRead = true;
    res.json({ success: true, data: message });
  } else {
    res.status(404).json({ success: false, message: 'Message not found' });
  }
});

app.delete('/api/contact/:id', (req, res) => {
  contactMessages = contactMessages.filter(m => m.id != req.params.id);
  res.json({ success: true, message: 'Message deleted' });
});

// ============ VISITOR ROUTES ============
app.post('/api/visitor', (req, res) => {
  const newVisitor = {
    id: Date.now(),
    ...req.body,
    visitDate: new Date(),
    ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown'
  };
  visitors.push(newVisitor);
  res.json({ success: true });
});

app.get('/api/visitor/stats', (req, res) => {
  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(v => new Date(v.visitDate).toDateString() === today).length;
  
  res.json({
    success: true,
    data: {
      total: visitors.length,
      today: todayVisitors,
      recent: visitors.slice(-10)
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (prevents default HTML 500 pages)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ PORTFOLIO CMS SERVER IS RUNNING!');
  console.log('='.repeat(60));
  console.log(`📍 Local URL:    http://localhost:${PORT}`);
  console.log(`📍 Network URL:  http://${localIp}:${PORT}`);
  console.log(`📍 API Base:     http://localhost:${PORT}/api`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log('\n🔐 LOGIN CREDENTIALS:');
  console.log('   Email:    rm91275@gmail.com');
  console.log('   Password: Admin@123');
  console.log('\n📊 DEFAULT DATA LOADED:');
  console.log(`   Services: ${portfolioData.services.length}`);
  console.log(`   Technical Skills: ${portfolioData.technicalSkills.length}`);
  console.log(`   Professional Skills: ${portfolioData.professionalSkills.length}`);
  console.log(`   Projects: ${portfolioData.projects.length}`);
  console.log(`   Teamwork: ${portfolioData.teamwork.length}`);
  console.log('\n🌐 CORS: Enabled for all origins');
  console.log('='.repeat(60) + '\n');
});