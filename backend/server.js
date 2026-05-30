const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// ✅ SIMPLE CORS - Allow everything
app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ============ INITIAL DATA ============
let portfolioData = {
  profile: {
    name: 'Rahul Mahato',
    title: 'Full Stack Developer',
    bio: 'Passionate Full Stack Developer with expertise in MERN stack',
    email: 'rm91275@gmail.com',
    phone: '+977 98XXXXXXXX',
    address: 'Kathmandu, Nepal'
  },
  about: {
    mainText: 'Full Stack Developer',
    paragraphs: ['Experienced developer', 'Passionate about coding']
  },
  services: [
    { id: 1, icon: 'bx bx-code-alt', title: 'Web Development', description: 'Modern websites' }
  ],
  technicalSkills: [
    { id: 1, name: 'HTML5', level: 90, icon: 'bx bxl-html5' }
  ],
  professionalSkills: [
    { id: 1, name: 'Problem Solving', level: 90 }
  ],
  projects: [
    { id: 1, title: 'Sample Project', description: 'A great project', technologies: ['React'] }
  ],
  teamwork: [
    { id: 1, title: 'Team Work', description: 'Collaborated effectively', role: 'Member' }
  ]
};

let contactMessages = [];
let visitors = [];

const JWT_SECRET = 'my-secret-key-2024';

// ============ AUTH ROUTES ============
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { email, password } = req.body;
  
  // Check credentials
  if (email === 'rm91275@gmail.com' && password === 'Admin@123') {
    const token = jwt.sign({ email, id: 1 }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      success: true,
      token: token,
      user: {
        id: 1,
        name: 'Rahul Mahato',
        email: email,
        role: 'admin'
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Use rm91275@gmail.com / Admin@123'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      success: true,
      user: {
        id: 1,
        name: 'Rahul Mahato',
        email: decoded.email,
        role: 'admin'
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ============ PORTFOLIO ROUTES ============
app.get('/api/portfolio', (req, res) => {
  res.json({ success: true, data: portfolioData });
});

app.put('/api/portfolio/profile', (req, res) => {
  portfolioData.profile = { ...portfolioData.profile, ...req.body };
  res.json({ success: true, data: portfolioData.profile });
});

app.put('/api/portfolio/about', (req, res) => {
  portfolioData.about = { ...portfolioData.about, ...req.body };
  res.json({ success: true, data: portfolioData.about });
});

// Services
app.get('/api/portfolio/services', (req, res) => {
  res.json({ success: true, data: portfolioData.services });
});

app.post('/api/portfolio/services', (req, res) => {
  const newService = { id: Date.now(), ...req.body };
  portfolioData.services.push(newService);
  res.json({ success: true, data: newService });
});

app.put('/api/portfolio/services/:id', (req, res) => {
  const index = portfolioData.services.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.services[index] = { ...portfolioData.services[index], ...req.body };
    res.json({ success: true, data: portfolioData.services[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/portfolio/services/:id', (req, res) => {
  portfolioData.services = portfolioData.services.filter(s => s.id != req.params.id);
  res.json({ success: true });
});

// Technical Skills
app.get('/api/portfolio/technical-skills', (req, res) => {
  res.json({ success: true, data: portfolioData.technicalSkills });
});

app.post('/api/portfolio/technical-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.technicalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

app.put('/api/portfolio/technical-skills/:id', (req, res) => {
  const index = portfolioData.technicalSkills.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.technicalSkills[index] = { ...portfolioData.technicalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.technicalSkills[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/portfolio/technical-skills/:id', (req, res) => {
  portfolioData.technicalSkills = portfolioData.technicalSkills.filter(s => s.id != req.params.id);
  res.json({ success: true });
});

// Professional Skills
app.get('/api/portfolio/professional-skills', (req, res) => {
  res.json({ success: true, data: portfolioData.professionalSkills });
});

app.post('/api/portfolio/professional-skills', (req, res) => {
  const newSkill = { id: Date.now(), ...req.body };
  portfolioData.professionalSkills.push(newSkill);
  res.json({ success: true, data: newSkill });
});

app.put('/api/portfolio/professional-skills/:id', (req, res) => {
  const index = portfolioData.professionalSkills.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    portfolioData.professionalSkills[index] = { ...portfolioData.professionalSkills[index], ...req.body };
    res.json({ success: true, data: portfolioData.professionalSkills[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/portfolio/professional-skills/:id', (req, res) => {
  portfolioData.professionalSkills = portfolioData.professionalSkills.filter(s => s.id != req.params.id);
  res.json({ success: true });
});

// Projects
app.get('/api/portfolio/projects', (req, res) => {
  res.json({ success: true, data: portfolioData.projects });
});

app.post('/api/portfolio/projects', (req, res) => {
  const newProject = { id: Date.now(), ...req.body };
  portfolioData.projects.push(newProject);
  res.json({ success: true, data: newProject });
});

app.put('/api/portfolio/projects/:id', (req, res) => {
  const index = portfolioData.projects.findIndex(p => p.id == req.params.id);
  if (index !== -1) {
    portfolioData.projects[index] = { ...portfolioData.projects[index], ...req.body };
    res.json({ success: true, data: portfolioData.projects[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/portfolio/projects/:id', (req, res) => {
  portfolioData.projects = portfolioData.projects.filter(p => p.id != req.params.id);
  res.json({ success: true });
});

// Teamwork
app.get('/api/portfolio/teamwork', (req, res) => {
  res.json({ success: true, data: portfolioData.teamwork });
});

app.post('/api/portfolio/teamwork', (req, res) => {
  const newTeamwork = { id: Date.now(), ...req.body };
  portfolioData.teamwork.push(newTeamwork);
  res.json({ success: true, data: newTeamwork });
});

app.put('/api/portfolio/teamwork/:id', (req, res) => {
  const index = portfolioData.teamwork.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    portfolioData.teamwork[index] = { ...portfolioData.teamwork[index], ...req.body };
    res.json({ success: true, data: portfolioData.teamwork[index] });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/portfolio/teamwork/:id', (req, res) => {
  portfolioData.teamwork = portfolioData.teamwork.filter(t => t.id != req.params.id);
  res.json({ success: true });
});

// Contact
app.post('/api/contact', (req, res) => {
  const newMessage = { id: Date.now(), ...req.body, createdAt: new Date(), isRead: false };
  contactMessages.push(newMessage);
  res.json({ success: true, message: 'Message sent' });
});

app.get('/api/contact', (req, res) => {
  res.json({ success: true, data: contactMessages });
});

app.put('/api/contact/:id/read', (req, res) => {
  const message = contactMessages.find(m => m.id == req.params.id);
  if (message) {
    message.isRead = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.delete('/api/contact/:id', (req, res) => {
  contactMessages = contactMessages.filter(m => m.id != req.params.id);
  res.json({ success: true });
});

// Visitor
app.post('/api/visitor', (req, res) => {
  visitors.push({ id: Date.now(), ...req.body, visitDate: new Date() });
  res.json({ success: true });
});

app.get('/api/visitor/stats', (req, res) => {
  const today = new Date().toDateString();
  const todayVisitors = visitors.filter(v => new Date(v.visitDate).toDateString() === today).length;
  res.json({
    success: true,
    data: { total: visitors.length, today: todayVisitors, recent: visitors.slice(-10) }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = 5002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 Network: http://${localIp}:${PORT}`);
  console.log(`\n🔐 Login: rm91275@gmail.com / Admin@123\n`);
});