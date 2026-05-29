// server.js - Complete Backend Server with Network Support
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Get local network IP addresses
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    return ips;
}

// Middleware - Allow all origins for network access
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/cv', express.static('cv'));
app.use('/images', express.static('public/images'));

// Get client IP address
app.get('/api/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip: ip });
});

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite');

// Create tables
db.serialize(() => {
    // Portfolio data table
    db.run(`CREATE TABLE IF NOT EXISTS portfolio_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_key TEXT UNIQUE,
        data_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Contact messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT
    )`);
    
    // Visitors table
    db.run(`CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        city TEXT,
        country TEXT,
        device TEXT,
        browser TEXT,
        visit_date DATE,
        visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Insert default admin (password: admin123)
    db.get("SELECT * FROM admin_users WHERE email = 'admin@gmail.com'", (err, row) => {
        if (!row) {
            db.run("INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)", 
                ['admin@gmail.com', 'admin123', 'Admin User']);
        }
    });
    
    // Insert default portfolio data
    const defaultData = {
        'portfolio_profile': {
            name: 'Rahul Mahato',
            title: 'Full Stack Developer',
            bio: 'I\'m a web Designer with extensive experience.',
            image: '/images/ME.jpeg',
            cv: '/cv/cv-3.docx',
            email: 'admin@gmail.com',
            phone: '+977 98XXXXXXXX',
            address: 'Kathmandu, Nepal'
        },
        'portfolio_about': {
            mainText: 'Full Stack Developer',
            paragraphs: [
                "I'm a Computer Science student at Techspire College in Kathmandu, Nepal.",
                "My journey in technology started with curiosity about how things work.",
                "When I'm not coding, you can find me exploring new design trends."
            ]
        },
        'portfolio_services': [
            { id: 1, icon: 'bx bx-code', title: 'Web Development', description: 'Modern responsive websites.' },
            { id: 2, icon: 'bx bx-crop', title: 'UI/UX Design', description: 'Beautiful interfaces.' },
            { id: 3, icon: 'bx bxl-apple', title: 'App Design', description: 'Mobile-first design.' }
        ],
        'portfolio_skills_technical': [
            { id: 1, name: 'HTML5', level: 90, icon: 'bx bxl-html5' },
            { id: 2, name: 'CSS3', level: 85, icon: 'bx bxl-css3' },
            { id: 3, name: 'JavaScript', level: 80, icon: 'bx bxl-javascript' },
            { id: 4, name: 'React', level: 75, icon: 'bx bxl-react' }
        ],
        'portfolio_skills_professional': [
            { id: 1, name: 'Creativity', level: 90 },
            { id: 2, name: 'Communication', level: 65 },
            { id: 3, name: 'Problem Solving', level: 85 },
            { id: 4, name: 'Team Work', level: 89 }
        ],
        'portfolio_projects': [
            { id: 1, title: 'E-Commerce Dashboard', description: 'Modern admin dashboard.', image: '/images/E-comerce.png', technologies: ['React', 'Node.js'] },
            { id: 2, title: 'Task Management App', description: 'Collaborative task management.', image: '/images/task-management.png', technologies: ['Vue.js', 'Express'] },
            { id: 3, title: 'Portfolio Website', description: 'Responsive portfolio website.', image: '/images/website.png', technologies: ['HTML', 'CSS', 'JS'] }
        ],
        'portfolio_teamwork': [
            { id: 1, title: 'Open Source Contribution', description: 'Collaborated with global developers.', image: '', role: 'Contributor' },
            { id: 2, title: 'Hackathon Winner', description: 'First place at college hackathon.', image: '', role: 'Team Lead' }
        ]
    };
    
    for (const [key, value] of Object.entries(defaultData)) {
        db.get("SELECT * FROM portfolio_data WHERE data_key = ?", [key], (err, row) => {
            if (!row) {
                db.run("INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)", 
                    [key, JSON.stringify(value)]);
            }
        });
    }
});

// ==================== API ROUTES ====================

// Get all portfolio data
app.get('/api/data', (req, res) => {
    db.all("SELECT data_key, data_value FROM portfolio_data", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const data = {};
        rows.forEach(row => {
            data[row.data_key] = JSON.parse(row.data_value);
        });
        res.json(data);
    });
});

// Save portfolio data
app.post('/api/data', (req, res) => {
    const { key, value } = req.body;
    db.run("INSERT OR REPLACE INTO portfolio_data (data_key, data_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
        [key, JSON.stringify(value)], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Data saved' });
        });
});

// Delete portfolio data
app.delete('/api/data', (req, res) => {
    const { key } = req.body;
    db.run("DELETE FROM portfolio_data WHERE data_key = ?", [key], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Data deleted' });
    });
});

// Admin login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM admin_users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (user) {
            res.json({ success: true, user: { name: user.name, email: user.email } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Save contact message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    db.run("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
        [name, email, message], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Message sent' });
        });
});

// Get contact messages
app.get('/api/contact', (req, res) => {
    db.all("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Track visitor
app.post('/api/visitor', (req, res) => {
    const { ip, city, country, device, browser } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ip;
    
    db.get("SELECT * FROM visitors WHERE ip = ? AND visit_date = ?", [clientIp, today], (err, existing) => {
        if (!existing) {
            db.run("INSERT INTO visitors (ip, city, country, device, browser, visit_date) VALUES (?, ?, ?, ?, ?, ?)",
                [clientIp, city || 'Unknown', country || 'Unknown', device || 'Desktop', browser || 'Unknown', today], (err) => {
                    if (err) console.error('Visitor tracking error:', err);
                });
        }
    });
    res.json({ success: true });
});

// Get visitor stats
app.get('/api/stats', (req, res) => {
    db.get("SELECT COUNT(*) as total FROM visitors", (err, total) => {
        db.get("SELECT COUNT(*) as today FROM visitors WHERE visit_date = date('now')", (err, today) => {
            db.all("SELECT city, country, device, visit_time FROM visitors ORDER BY id DESC LIMIT 10", (err, recent) => {
                res.json({
                    total: total?.total || 0,
                    today: today?.today || 0,
                    recent: recent || []
                });
            });
        });
    });
});

// Image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true, url: '/uploads/' + req.file.filename });
    } else {
        res.status(400).json({ success: false, error: 'No file uploaded' });
    }
});

// Get server network info
app.get('/api/network-info', (req, res) => {
    const ips = getLocalIPs();
    res.json({
        localhost: `http://localhost:${PORT}`,
        network: ips.map(ip => `http://${ip}:${PORT}`),
        port: PORT,
        ips: ips
    });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIPs();
    console.log('\n🚀 Server is running!\n');
    console.log(`📱 Local access:    http://localhost:${PORT}`);
    console.log(`📱 Admin login:     http://localhost:${PORT}/login.html`);
    if (ips.length > 0) {
        console.log(`\n📡 Network access (for other devices):`);
        ips.forEach(ip => {
            console.log(`   → http://${ip}:${PORT}`);
            console.log(`   → http://${ip}:${PORT}/login.html`);
        });
    }
    console.log(`\n🔐 Login: admin@gmail.com / admin123`);
    console.log(`💾 Database: SQLite (database.sqlite)\n`);
});