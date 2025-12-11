import api from './api';

const asetService = {
  // Get all aset
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/aset', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal mengambil data aset'
      };
    }
  },

  // Get single aset
  getById: async (id) => {
    try {
      const response = await api.get(`/aset/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal mengambil detail aset'
      };
    }
  },

  // Create aset
  create: async (data) => {
    try {
      const response = await api.post('/aset', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal menambah aset'
      };
    }
  },

  // Update aset
  update: async (id, data) => {
    try {
      const response = await api.put(`/aset/${id}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Gagal mengupdate aset'
      };
    }
  },

  // Delete aset
  delete: async (id) => {
    try {
      const response = await api.delete(`/aset/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gagal menghapus aset'
      };
    }
  }
};

export default asetService;