// Backup configuration for Skills section
const defaultTechnicalSkills = [
    { name: 'HTML', level: 90, icon: 'bx bxl-html5', color: '#e34c26' },
    { name: 'CSS', level: 85, icon: 'bx bxl-css3', color: '#264de4' },
    { name: 'JavaScript', level: 80, icon: 'bx bxl-javascript', color: '#f0db4f' },
    { name: 'React', level: 75, icon: 'bx bxl-react', color: '#61DAFB' },
    { name: 'Python', level: 85, icon: 'bx bxl-python', color: '#3776AB' },
    { name: 'Node.js', level: 70, icon: 'bx bxl-nodejs', color: '#68A063' }
];

const defaultProfessionalSkills = [
    { name: 'Creativity', level: 90 },
    { name: 'Communication', level: 65 },
    { name: 'Problem Solving', level: 85 },
    { name: 'Team Work', level: 89 }
];

if (!localStorage.getItem('portfolio_skills_technical')) {
    localStorage.setItem('portfolio_skills_technical', JSON.stringify(defaultTechnicalSkills));
}
if (!localStorage.getItem('portfolio_skills_professional')) {
    localStorage.setItem('portfolio_skills_professional', JSON.stringify(defaultProfessionalSkills));
}