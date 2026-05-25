// API-like data loader - loads all content from localStorage
window.ApiLoader = {
    getProfile: () => JSON.parse(localStorage.getItem('portfolio_profile')) || {},
    getAbout: () => JSON.parse(localStorage.getItem('portfolio_about')) || {},
    getServices: () => JSON.parse(localStorage.getItem('portfolio_services')) || [],
    getTechnicalSkills: () => JSON.parse(localStorage.getItem('portfolio_skills_technical')) || [],
    getProfessionalSkills: () => JSON.parse(localStorage.getItem('portfolio_skills_professional')) || [],
    getProjects: () => JSON.parse(localStorage.getItem('portfolio_projects')) || [],
    getTeamwork: () => JSON.parse(localStorage.getItem('portfolio_teamwork')) || [],
    getMessages: () => JSON.parse(localStorage.getItem('contact_messages')) || [],
    saveProfile: (data) => localStorage.setItem('portfolio_profile', JSON.stringify(data)),
    saveAbout: (data) => localStorage.setItem('portfolio_about', JSON.stringify(data)),
    saveServices: (data) => localStorage.setItem('portfolio_services', JSON.stringify(data)),
    saveTechnicalSkills: (data) => localStorage.setItem('portfolio_skills_technical', JSON.stringify(data)),
    saveProfessionalSkills: (data) => localStorage.setItem('portfolio_skills_professional', JSON.stringify(data)),
    saveProjects: (data) => localStorage.setItem('portfolio_projects', JSON.stringify(data)),
    saveTeamwork: (data) => localStorage.setItem('portfolio_teamwork', JSON.stringify(data))
};