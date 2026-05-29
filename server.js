// server.js - Updated to use environment variables
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/cv', express.static(path.join(__dirname, 'cv')));

// Favicon
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(__dirname, 'public/images/rahul.svg');
    if (fs.existsSync(faviconPath)) {
        res.sendFile(faviconPath);
    } else {
        res.status(204).end();
    }
});

// File upload
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
const upload = multer({ 
    storage: storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 }
});

// Database path based on environment
const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS portfolio_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_key TEXT UNIQUE,
        data_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT
    )`);
    
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
    
    // Insert default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    
    db.get("SELECT * FROM admin_users WHERE email = ?", [adminEmail], (err, row) => {
        if (!row && !err) {
            db.run("INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)", 
                [adminEmail, adminPassword, adminName]);
            console.log('✅ Default admin user created');
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
            email: adminEmail,
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
            if (!row && !err) {
                db.run("INSERT INTO portfolio_data (data_key, data_value) VALUES (?, ?)", 
                    [key, JSON.stringify(value)]);
            }
        });
    }
});

// ==================== API ROUTES ====================

app.get('/api/data', (req, res) => {
    db.all("SELECT data_key, data_value FROM portfolio_data", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const data = {};
        rows.forEach(row => {
            try {
                data[row.data_key] = JSON.parse(row.data_value);
            } catch(e) {
                data[row.data_key] = row.data_value;
            }
        });
        res.json(data);
    });
});

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

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email);
    
    db.get("SELECT * FROM admin_users WHERE email = ? AND password = ?", [email, password], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        if (user) {
            console.log('Login successful:', email);
            res.json({ success: true, user: { name: user.name, email: user.email } });
        } else {
            console.log('Login failed:', email);
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    db.run("INSERT INTO contact_messages (name, email, message, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        [name, email, message], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Message sent' });
        });
});

app.get('/api/contact', (req, res) => {
    db.all("SELECT * FROM contact_messages ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/visitor', (req, res) => {
    const { device, browser } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    db.get("SELECT * FROM visitors WHERE ip = ? AND visit_date = ?", [clientIp, today], (err, existing) => {
        if (!existing && !err) {
            db.run("INSERT INTO visitors (ip, device, browser, visit_date) VALUES (?, ?, ?, ?)",
                [clientIp, device || 'Desktop', browser || 'Unknown', today]);
        }
    });
    res.json({ success: true });
});

app.get('/api/stats', (req, res) => {
    db.get("SELECT COUNT(*) as total FROM visitors", (err, total) => {
        db.get("SELECT COUNT(*) as today FROM visitors WHERE visit_date = date('now')", (err, today) => {
            db.all("SELECT ip, device, visit_time FROM visitors ORDER BY id DESC LIMIT 10", (err, recent) => {
                res.json({
                    total: total?.total || 0,
                    today: today?.today || 0,
                    recent: recent || []
                });
            });
        });
    });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ success: true, url: '/uploads/' + req.file.filename });
    } else {
        res.status(400).json({ success: false, error: 'No file uploaded' });
    }
});

app.get('/api/network-info', (req, res) => {
    const ips = getLocalIPs();
    res.json({
        localhost: `http://localhost:${PORT}`,
        network: ips.map(ip => `http://${ip}:${PORT}`),
        port: PORT,
        ips: ips,
        environment: NODE_ENV
    });
});

// ==================== HTML ROUTES ====================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/network-info.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'network-info.html'));
});

// 404 handler
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint not found' });
        return;
    }
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIPs();
    console.log('\n✅ ========================================');
    console.log(`🚀 PORTFOLIO CMS SERVER RUNNING (${NODE_ENV})`);
    console.log('========================================\n');
    console.log(`📱 Local access:    http://localhost:${PORT}`);
    console.log(`🔐 Admin login:     http://localhost:${PORT}/login.html`);
    console.log(`📊 Admin panel:     http://localhost:${PORT}/admin.html`);
    if (ips.length > 0 && NODE_ENV === 'development') {
        console.log(`\n📡 Network access (for other devices):`);
        ips.forEach(ip => {
            console.log(`   → http://${ip}:${PORT}`);
        });
    }
    if (process.env.SITE_URL) {
        console.log(`\n🌐 Production URL: ${process.env.SITE_URL}`);
    }
    console.log(`\n🔐 Default Login: ${process.env.ADMIN_EMAIL || 'admin@gmail.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`💾 Database: ${dbPath}`);
    console.log('========================================\n');
});