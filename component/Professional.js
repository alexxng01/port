// Load professional experience data
function loadProfessionalData() {
    const experience = JSON.parse(localStorage.getItem('portfolio_experience')) || [
        {
            id: 1,
            title: 'Full Stack Developer',
            company: 'Tech Solutions Inc.',
            period: '2023 - Present',
            description: 'Developing web applications using React and Node.js. Collaborating with cross-functional teams to deliver high-quality software.'
        },
        {
            id: 2,
            title: 'Frontend Developer',
            company: 'Creative Agency',
            period: '2022 - 2023',
            description: 'Built responsive websites for various clients. Implemented modern UI/UX designs and optimized performance.'
        },
        {
            id: 3,
            title: 'Intern Web Developer',
            company: 'Digital Solutions',
            period: '2021 - 2022',
            description: 'Assisted in developing client websites. Learned industry best practices and version control with Git.'
        }
    ];
    
    const container = document.querySelector('.timeline');
    if (container) {
        container.innerHTML = experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-content">
                    <h3>${exp.title}</h3>
                    <h4>${exp.company}</h4>
                    <p>${exp.description}</p>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadProfessionalData);