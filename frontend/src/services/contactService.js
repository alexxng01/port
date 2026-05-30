import api from './api';

const contactService = {
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/contact', messageData);
      return {
        success: true,
        message: response.data.message || 'Message sent successfully'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  getMessages: async () => {
    try {
      const response = await api.get('/contact');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch messages',
        data: []
      };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.put(`/contact/${id}/read`);
      return {
        success: true,
        data: response.data.data,
        message: 'Message marked as read'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read'
      };
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await api.delete(`/contact/${id}`);
      return {
        success: true,
        message: response.data.message || 'Message deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete message'
      };
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/contact');
      const unreadCount = (response.data.data || []).filter(msg => !msg.isRead).length;
      return {
        success: true,
        count: unreadCount
      };
    } catch (error) {
      return {
        success: false,
        count: 0
      };
    }
  }
};

const visitorService = {
  trackVisitor: async (visitorData) => {
    try {
      console.log('Tracking visitor to:', '/visitor');
      const response = await api.post('/visitor', visitorData);
      console.log('Visitor tracked successfully');
      return { success: true };
    } catch (error) {
      console.error('Error tracking visitor:', error);
      return { success: false };
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/visitor/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
        data: null
      };
    }
  }
};

export default contactService;
export { contactService, visitorService };