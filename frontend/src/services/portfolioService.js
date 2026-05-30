import api from './api';

export const portfolioService = {
  // Get all portfolio data
  getPortfolio: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  // Profile
  updateProfile: async (profileData) => {
    const response = await api.put('/portfolio/profile', profileData);
    return response.data;
  },

  // About
  updateAbout: async (aboutData) => {
    const response = await api.put('/portfolio/about', aboutData);
    return response.data;
  },

  // Services
  addService: async (serviceData) => {
    const response = await api.post('/portfolio/services', serviceData);
    return response.data;
  },
  updateService: async (id, serviceData) => {
    const response = await api.put(`/portfolio/services/${id}`, serviceData);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await api.delete(`/portfolio/services/${id}`);
    return response.data;
  },

  // Technical Skills
  addTechnicalSkill: async (skillData) => {
    const response = await api.post('/portfolio/technical-skills', skillData);
    return response.data;
  },
  updateTechnicalSkill: async (id, skillData) => {
    const response = await api.put(`/portfolio/technical-skills/${id}`, skillData);
    return response.data;
  },
  deleteTechnicalSkill: async (id) => {
    const response = await api.delete(`/portfolio/technical-skills/${id}`);
    return response.data;
  },

  // Professional Skills
  addProfessionalSkill: async (skillData) => {
    const response = await api.post('/portfolio/professional-skills', skillData);
    return response.data;
  },
  updateProfessionalSkill: async (id, skillData) => {
    const response = await api.put(`/portfolio/professional-skills/${id}`, skillData);
    return response.data;
  },
  deleteProfessionalSkill: async (id) => {
    const response = await api.delete(`/portfolio/professional-skills/${id}`);
    return response.data;
  },

  // Projects
  addProject: async (projectData) => {
    const response = await api.post('/portfolio/projects', projectData);
    return response.data;
  },
  updateProject: async (id, projectData) => {
    const response = await api.put(`/portfolio/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await api.delete(`/portfolio/projects/${id}`);
    return response.data;
  },

  // Teamwork
  addTeamwork: async (teamworkData) => {
    const response = await api.post('/portfolio/teamwork', teamworkData);
    return response.data;
  },
  updateTeamwork: async (id, teamworkData) => {
    const response = await api.put(`/portfolio/teamwork/${id}`, teamworkData);
    return response.data;
  },
  deleteTeamwork: async (id) => {
    const response = await api.delete(`/portfolio/teamwork/${id}`);
    return response.data;
  },
};