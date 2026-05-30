import api from './api';

const portfolioService = {
  // Get all portfolio data
  getPortfolio: async () => {
    try {
      console.log('Fetching portfolio from:', '/portfolio');
      const response = await api.get('/portfolio');
      console.log('Portfolio fetched successfully');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch portfolio',
        data: null
      };
    }
  },

  // Profile Management
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/portfolio/profile', profileData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // About Management
  updateAbout: async (aboutData) => {
    try {
      const response = await api.put('/portfolio/about', aboutData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update about section'
      };
    }
  },

  // Services Management
  addService: async (serviceData) => {
    try {
      const response = await api.post('/portfolio/services', serviceData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add service'
      };
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/portfolio/services/${id}`, serviceData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update service'
      };
    }
  },

  deleteService: async (id) => {
    try {
      const response = await api.delete(`/portfolio/services/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete service'
      };
    }
  },

  // Technical Skills Management
  addTechnicalSkill: async (skillData) => {
    try {
      const response = await api.post('/portfolio/technical-skills', skillData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add technical skill'
      };
    }
  },

  updateTechnicalSkill: async (id, skillData) => {
    try {
      const response = await api.put(`/portfolio/technical-skills/${id}`, skillData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update technical skill'
      };
    }
  },

  deleteTechnicalSkill: async (id) => {
    try {
      const response = await api.delete(`/portfolio/technical-skills/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete technical skill'
      };
    }
  },

  // Professional Skills Management
  addProfessionalSkill: async (skillData) => {
    try {
      const response = await api.post('/portfolio/professional-skills', skillData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add professional skill'
      };
    }
  },

  updateProfessionalSkill: async (id, skillData) => {
    try {
      const response = await api.put(`/portfolio/professional-skills/${id}`, skillData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update professional skill'
      };
    }
  },

  deleteProfessionalSkill: async (id) => {
    try {
      const response = await api.delete(`/portfolio/professional-skills/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete professional skill'
      };
    }
  },

  // Projects Management
  addProject: async (projectData) => {
    try {
      const response = await api.post('/portfolio/projects', projectData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add project'
      };
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/portfolio/projects/${id}`, projectData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update project'
      };
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/portfolio/projects/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete project'
      };
    }
  },

  // Teamwork Management
  addTeamwork: async (teamworkData) => {
    try {
      const response = await api.post('/portfolio/teamwork', teamworkData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add teamwork'
      };
    }
  },

  updateTeamwork: async (id, teamworkData) => {
    try {
      const response = await api.put(`/portfolio/teamwork/${id}`, teamworkData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update teamwork'
      };
    }
  },

  deleteTeamwork: async (id) => {
    try {
      const response = await api.delete(`/portfolio/teamwork/${id}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete teamwork'
      };
    }
  }
};

// Export both as default and named export
export default portfolioService;
export { portfolioService };