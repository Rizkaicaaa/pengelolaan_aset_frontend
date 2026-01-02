// src/services/pengajuanService.js
import api from './api';

const pengajuanService = {
  /**
   * Get all procurement requests (role-based)
   * Admin Jurusan: semua data
   * Dosen/Admin Lab: data milik sendiri
   */
  getAll: async (searchQuery = '') => {
    try {
      const endpoint = searchQuery 
        ? `/procurement-requests?search=${encodeURIComponent(searchQuery)}`
        : '/procurement-requests';
      
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil data pengajuan' };
    }
  },

  /**
   * Get procurement request by ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/procurement-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal mengambil detail pengajuan' };
    }
  },

  /**
   * Create new procurement request
   * Only for Dosen & Admin Lab
   */
  create: async (data) => {
    try {
      const payload = {
        assetName: data.assetName,
        quantity: data.quantity,
        category: data.category,
        reason: data.reason,
        image_reference: data.image_reference
      };

      const response = await api.post('/procurement-requests', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal membuat pengajuan' };
    }
  },

  /**
   * Update procurement request
   * Only owner can update & only if status is pending
   */
  update: async (id, data) => {
    try {
      const payload = {
        assetName: data.assetName,
        quantity: data.quantity,
        category: data.category,
        reason: data.reason,
        image_reference: data.image_reference
      };

      const response = await api.put(`/procurement-requests/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal memperbarui pengajuan' };
    }
  },

  /**
   * Update status procurement request
   * Only Admin Jurusan can update status
   */
  updateStatus: async (id, statusData) => {
    try {
      const payload = {
        requestStatus: statusData.requestStatus, // 'approved' or 'rejected'
        rejectionReason: statusData.rejectionReason || null,
      };

      const response = await api.patch(`/procurement-requests/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal memperbarui status' };
    }
  },

  /**
   * Delete procurement request
   * Only owner can delete & only if status is pending
   * Admin Jurusan cannot delete
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/procurement-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Gagal menghapus pengajuan' };
    }
  },
};

export default pengajuanService;