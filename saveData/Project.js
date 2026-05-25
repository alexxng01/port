// Backup configuration for Projects section
const defaultProjectsData = [
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

if (!localStorage.getItem('portfolio_projects')) {
    localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjectsData));
}