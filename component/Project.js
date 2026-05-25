// Load projects from localStorage
function loadProjectsData() {
    const projects = JSON.parse(localStorage.getItem('portfolio_projects')) || [
        {
            id: 1,
            title: 'E-Commerce Dashboard',
            description: 'A modern admin dashboard for managing online stores with real-time analytics, inventory management, and customer insights.',
            image: 'images/E-comerce.png',
            technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MySQL']
        },
        {
            id: 2,
            title: 'Task Management App',
            description: 'A collaborative task management application with drag-and-drop functionality, team collaboration features, and progress tracking.',
            image: 'images/task-management.png',
            technologies: ['React', 'Python', 'Flask', 'SQLite', 'Figma']
        },
        {
            id: 3,
            title: 'Portfolio Website',
            description: 'A responsive portfolio website showcasing projects and skills with modern animations and clean design principles.',
            image: 'images/website.png',
            technologies: ['HTML', 'CSS', 'JavaScript', 'GSAP']
        }
    ];
    
    const container = document.getElementById('projectsList');
    if (container) {
        container.innerHTML = projects.map(project => `
            <div class="row">
                <img src="${project.image}" alt="${project.title}">
                <div class="layer">
                    <h5>${project.title}</h5>
                    <p>${project.description.substring(0, 100)}...</p>
                    <div class="project-tech" style="margin-top: 10px;">
                        ${project.technologies.map(tech => `<span class="tech-tag" style="background: #0ef; color:#000; padding:2px 8px; border-radius:20px; font-size:11px; margin:2px;">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadProjectsData);