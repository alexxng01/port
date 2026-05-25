// Load all dynamic content from localStorage
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadAbout();
    loadServices();
    loadTechnicalSkills();
    loadProfessionalSkills();
    loadProjects();
    loadTeamwork();
    loadContactForm();
    initTyped();
    initBurgerMenu();
});

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('portfolio_profile')) || {
        name: 'Rahul Mahato',
        title: 'Full Stack Developer',
        bio: 'I\'m a web Designer with extensive experience for over 2 months.',
        image: './images/ME.jpeg',
        cv: 'cv/cv-3.docx'
    };
    document.getElementById('adminNameDisplay').innerText = profile.name;
    document.getElementById('homeDescription').innerText = profile.bio;
    const profileImg = document.getElementById('profileImage');
    if (profileImg) profileImg.src = profile.image;
}

function loadAbout() {
    const about = JSON.parse(localStorage.getItem('portfolio_about')) || {
        mainText: 'Full Stack Developer',
        paragraphs: [
            'I\'m a Computer Science student at Techspire College in Kathmandu, Nepal.',
            'My journey in technology started with curiosity about how things work.'
        ]
    };
    const aboutContent = document.getElementById('aboutContent');
    if (aboutContent) aboutContent.innerHTML = `<h4>${about.mainText}</h4>`;
    const paraContainer = document.getElementById('aboutParagraphs');
    if (paraContainer) {
        paraContainer.innerHTML = `
            <div class="first">
                ${about.paragraphs.map(p => `<p class="about-paragraph">${p}</p>`).join('')}
            </div>
        `;
    }
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('portfolio_services')) || [];
    const container = document.getElementById('servicesList');
    if (container) {
        container.innerHTML = services.map(s => `
            <div>
                <i class='${s.icon}' style="color: #08f6d9"></i>
                <h2>${s.title}</h2>
                <p>${s.description}</p>
                <a href="#" class="read">Learn More</a>
            </div>
        `).join('');
    }
}

function loadTechnicalSkills() {
    const skills = JSON.parse(localStorage.getItem('portfolio_skills_technical')) || [];
    const container = document.getElementById('technicalSkills');
    if (container) {
        container.innerHTML = `
            <div class="skill-category">
                <h3>Technical Skills</h3>
                ${skills.map(s => `
                    <div class="bar">
                        <i class='${s.icon || 'bx bx-code'}'></i>
                        <div class="indfo"><span>${s.name}</span></div>
                        <div class="progress-line"><span style="width: ${s.level}%"></span></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function loadProfessionalSkills() {
    const skills = JSON.parse(localStorage.getItem('portfolio_skills_professional')) || [];
    const container = document.getElementById('professionalSkills');
    if (container) {
        container.innerHTML = skills.map((s, i) => `
            <div class="radial-bar">
                <svg viewBox="0 0 200 200">
                    <circle class="progress-bar" cx="100" cy="100" r="80"></circle>
                    <circle class="path" cx="100" cy="100" r="80" style="stroke-dashoffset: ${502 - (502 * s.level / 100)}"></circle>
                </svg>
                <div class="percentage">${s.level}%</div>
                <div class="text">${s.name}</div>
            </div>
        `).join('');
    }
}

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('portfolio_projects')) || [];
    const container = document.getElementById('projectsList');
    if (container) {
        container.innerHTML = projects.map(p => `
            <div class="row">
                <img src="${p.image || 'images/placeholder.png'}">
                <div class="layer">
                    <h5>${p.title}</h5>
                    <p>${p.description}</p>
                    <p><small>${(p.technologies || []).join(', ')}</small></p>
                </div>
            </div>
        `).join('');
    }
}

function loadTeamwork() {
    const teamwork = JSON.parse(localStorage.getItem('portfolio_teamwork')) || [];
    const container = document.getElementById('teamworkList');
    if (container) {
        container.innerHTML = teamwork.map(t => `
            <div class="row">
                <img src="${t.image || 'images/placeholder.png'}">
                <div class="layer">
                    <h5>${t.title}</h5>
                    <p>${t.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function loadContactForm() {
    const container = document.getElementById('contactSection');
    if (container) {
        container.innerHTML = `
            <div class="contact">
                <div class="contact-form">
                    <h2>Contact <span>Me</span></h2>
                    <form onsubmit="submitContact(event)">
                        <input type="text" placeholder="Your Name" id="contactName" required>
                        <input type="email" placeholder="Your Email" id="contactEmail" required>
                        <textarea placeholder="Your Message" id="contactMessage" rows="5" required></textarea>
                        <button type="submit" class="btn-box">Send Message</button>
                    </form>
                </div>
            </div>
        `;
    }
}

function submitContact(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
    messages.push({ id: Date.now(), name, email, message, date: new Date().toISOString() });
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    
    alert('Message sent successfully!');
    event.target.reset();
}

function initTyped() {
    const typedElement = document.querySelector('.text');
    if (typedElement) {
        new Typed('.text', {
            strings: ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }
}

function initBurgerMenu() {
    const burger = document.querySelector('.burger');
    const navbar = document.querySelector('.navbar');
    if (burger && navbar) {
        burger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
}

function viewProjects() {
    document.getElementById('project').scrollIntoView({ behavior: 'smooth' });
}

function downloadCV() {
    const profile = JSON.parse(localStorage.getItem('portfolio_profile')) || {};
    const cvUrl = profile.cv || 'cv/cv-3.docx';
    window.open(cvUrl, '_blank');
}