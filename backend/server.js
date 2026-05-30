const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Complete CORS fix
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory database
let portfolioData = {
  profile: {
    name: 'Rahul Mahato',
    title: 'Full Stack Developer',
    bio: 'Web Developer with expertise in MERN stack',
    email: process.env.ADMIN_EMAIL || 'rm91275@gmail.com',
    phone: '+977 98XXXXXXXX',
    address: 'Kathmandu, Nepal',
    github: '',
    linkedin: '',
    image: ''
  },
  about: {
    mainText: 'Full Stack Developer',
    paragraphs: ['Experienced developer with 5+ years in web development', 'Passionate about creating beautiful and functional websites']
  },
  services: [
    { id: 1, icon: 'bx bx-code', title: 'Web Development', description: 'Modern responsive websites' }
  ],
  technicalSkills: [
    { id: 1, name: 'HTML5', level: 90, icon: 'bx bxl-html5' },
    { id: 2, name: 'CSS3', level: 85, icon: 'bx bxl-css3' },
    { id: 3, name: 'JavaScript', level: 80, icon: 'bx bxl-javascript' }
  ],
  professionalSkills: [
    { id: 1, name: 'Creativity', level: 90 },
    { id: 2, name: 'Communication', level: 85 }
  ],
  projects: [
    { id: 1, title: 'E-Commerce Dashboard', description: 'Modern admin dashboard', technologies: ['React', 'Node.js'] }
  ],
  teamwork: []
};

// JWT for authentication
const jwt = require('jsonwebtoken');

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body.email);
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_EMAIL || 'rm91275@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  
  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    res.json({
      success: true,
      token,
      user: {
        id: 1,
        name: 'Admin',
        email: adminEmail,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'rm91275@gmail.com',
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Get portfolio
app.get('/api/portfolio', (req, res) => {
  res.json({ success: true, data: portfolioData });
});

// Update profile
app.put('/api/portfolio/profile', (req, res) => {
  portfolioData.profile = { ...portfolioData.profile, ...req.body };
  res.json({ success: true, data: portfolioData.profile });
});

// Update about
app.put('/api/portfolio/about', (req, res) => {
  portfolioData.about = { ...portfolioData.about, ...req.body };
  res.json({ success: true, data: portfolioData.about });
});

// Services CRUD
app.post('/api/portfolio/services', (req, res) => {
  const newService = { id: Date.now(), ...req.body };
  portfolioData.services.push(newService);
  res.json({ success: true, data: newService });
});

app.put('/api/portfolio/services/:id', (req, res) => {
  const index = portfolioData.services.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    portfolioData.services[index] = { ...portfolioData.services[index], ...req.body };
    res.json({ success: true, data: portfolioData.services[index] });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/portfolio/services/:id', (req, res) => {
  portfolioData.services = portfolioData.services.filter(s => s.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Technical Skills CRUD
app.post('/api/portfolio/technical-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.technicalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

app.put('/api/portfolio/technical-skills/:id', (req, res) => {
  const index = portfolioData.technicalSkills.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    portfolioData.technicalSkills[index] = { ...portfolioData.technicalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.technicalSkills[index] });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/portfolio/technical-skills/:id', (req, res) => {
  portfolioData.technicalSkills = portfolioData.technicalSkills.filter(s => s.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Professional Skills CRUD
app.post('/api/portfolio/professional-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.professionalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

app.put('/api/portfolio/professional-skills/:id', (req, res) => {
  const index = portfolioData.professionalSkills.findIndex(s => s.id === parseInt(req.params.id));
  if (index !== -1) {
    portfolioData.professionalSkills[index] = { ...portfolioData.professionalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.professionalSkills[index] });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/portfolio/professional-skills/:id', (req, res) => {
  portfolioData.professionalSkills = portfolioData.professionalSkills.filter(s => s.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Projects CRUD
app.post('/api/portfolio/projects', (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  portfolioData.projects.push(newProject);
  res.json({ success: true, data: newProject });
});

app.put('/api/portfolio/projects/:id', (req, res) => {
  const index = portfolioData.projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    portfolioData.projects[index] = { ...portfolioData.projects[index], ...req.body };
    res.json({ success: true, data: portfolioData.projects[index] });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/portfolio/projects/:id', (req, res) => {
  portfolioData.projects = portfolioData.projects.filter(p => p.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Teamwork CRUD
app.post('/api/portfolio/teamwork', (req, res) => {
  const newTeamwork = { id: Date.now(), ...req.body };
  portfolioData.teamwork.push(newTeamwork);
  res.json({ success: true, data: newTeamwork });
});

app.put('/api/portfolio/teamwork/:id', (req, res) => {
  const index = portfolioData.teamwork.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    portfolioData.teamwork[index] = { ...portfolioData.teamwork[index], ...req.body };
    res.json({ success: true, data: portfolioData.teamwork[index] });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/portfolio/teamwork/:id', (req, res) => {
  portfolioData.teamwork = portfolioData.teamwork.filter(t => t.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Contact messages
let contactMessages = [];

app.post('/api/contact', (req, res) => {
  const newMessage = { id: Date.now(), ...req.body, createdAt: new Date(), isRead: false };
  contactMessages.push(newMessage);
  res.json({ success: true, message: 'Message sent' });
});

app.get('/api/contact', (req, res) => {
  res.json({ success: true, data: contactMessages });
});

app.put('/api/contact/:id/read', (req, res) => {
  const message = contactMessages.find(m => m.id === parseInt(req.params.id));
  if (message) {
    message.isRead = true;
    res.json({ success: true, data: message });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

app.delete('/api/contact/:id', (req, res) => {
  contactMessages = contactMessages.filter(m => m.id !== parseInt(req.params.id));
  res.json({ success: true, message: 'Deleted' });
});

// Visitor tracking
let visitors = [];

app.post('/api/visitor', (req, res) => {
  visitors.push({ id: Date.now(), ...req.body, visitDate: new Date() });
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log(`\n🔐 Login with:`);
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'rm91275@gmail.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  console.log(`\n🌐 CORS enabled for http://localhost:3000\n`);
});