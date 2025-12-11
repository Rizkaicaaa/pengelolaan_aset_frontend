import api from './api';

const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal'
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/logout');
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Logout gagal' };
    }
  },

  // Get current user
  me: async () => {
    try {
      const response = await api.get('/me');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal mengambil data user'
      };
    }
  }
};

export default authService;