import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import pengajuanService from '../services/pengajuanService';
import Navbar from '../components/Navbar';

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Form Modal untuk Create/Edit
const ProcurementFormModal = ({ isOpen, onClose, onSubmit, initialData = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    assetName: '',
    quantity: 1,
    category: 'electronics',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        assetName: initialData.assetName || '',
        quantity: initialData.quantity || 1,
        category: initialData.category || 'electronics',
        reason: initialData.reason || ''
      });
    } else {
      setFormData({
        assetName: '',
        quantity: 1,
        category: 'electronics',
        reason: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? 'Buat Pengajuan Baru' : 'Edit Pengajuan'}>
      <div className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Aset <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.assetName}
            onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="stationary">Stationary</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alasan Pengajuan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : mode === 'create' ? 'Buat Pengajuan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Modal untuk Update Status (Admin Jurusan)
const StatusUpdateModal = ({ isOpen, onClose, onSubmit, procurement }) => {
  const [status, setStatus] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      setError('Alasan penolakan harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        requestStatus: status,
        rejectionReason: status === 'rejected' ? rejectionReason : null
      });
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Status Pengajuan">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">{procurement?.assetName}</h4>
          <p className="text-sm text-gray-600">Pengaju: {procurement?.user?.name}</p>
          <p className="text-sm text-gray-600">Jumlah: {procurement?.quantity}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        {status === 'rejected' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : 'Update Status'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Modal Detail
const DetailModal = ({ isOpen, onClose, procurement }) => {
  if (!procurement) return null;

  const statusConfig = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
    rejected: { label: 'Ditolak', class: 'bg-red-100 text-red-800' }
  };

  const status = statusConfig[procurement.requestStatus] || statusConfig.pending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Pengajuan" size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nama Aset</label>
            <p className="mt-1 text-gray-900">{procurement.assetName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Jumlah</label>
            <p className="mt-1 text-gray-900">{procurement.quantity}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Kategori</label>
            <p className="mt-1 text-gray-900 capitalize">{procurement.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
              {status.label}
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Pengaju</label>
            <p className="mt-1 text-gray-900">{procurement.user?.name || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tanggal Pengajuan</label>
            <p className="mt-1 text-gray-900">
              {new Date(procurement.createdAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Alasan Pengajuan</label>
          <p className="mt-1 text-gray-900 whitespace-pre-wrap">{procurement.reason}</p>
        </div>

        {procurement.rejectionReason && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="text-sm font-medium text-red-800">Alasan Penolakan</label>
            <p className="mt-1 text-red-700">{procurement.rejectionReason}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Component
const ProcurementRequestPage = () => {
  const { user } = useAuth();
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  const [selectedProcurement, setSelectedProcurement] = useState(null);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    loadProcurements();
  }, []);

  const loadProcurements = async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await pengajuanService.getAll(search);
      setProcurements(response.data || []);
    } catch (err) {
      setError('Gagal memuat data pengajuan');
      console.error('Error loading procurements:', err);
      setProcurements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    loadProcurements(searchTerm);
  };

  const handleCreate = async (formData) => {
    try {
      await pengajuanService.create(formData);
      loadProcurements(searchTerm);
    } catch (error) {
      throw new Error(error.message || 'Gagal membuat pengajuan');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await pengajuanService.update(selectedProcurement.id, formData);
      loadProcurements(searchTerm);
    } catch (error) {
      throw new Error(error.message || 'Gagal memperbarui pengajuan');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      await pengajuanService.updateStatus(selectedProcurement.id, statusData);
      loadProcurements(searchTerm);
    } catch (error) {
      throw new Error(error.message || 'Gagal memperbarui status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengajuan ini?')) {
      try {
        await pengajuanService.delete(id);
        loadProcurements(searchTerm);
      } catch (err) {
        alert('Terjadi kesalahan saat menghapus pengajuan');
        console.error('Error deleting procurement:', err);
      }
    }
  };

  const openCreateModal = () => {
    setFormMode('create');
    setSelectedProcurement(null);
    setShowFormModal(true);
  };

  const openEditModal = (procurement) => {
    setFormMode('edit');
    setSelectedProcurement(procurement);
    setShowFormModal(true);
  };

  const openStatusModal = (procurement) => {
    setSelectedProcurement(procurement);
    setShowStatusModal(true);
  };

  const openDetailModal = (procurement) => {
    setSelectedProcurement(procurement);
    setShowDetailModal(true);
  };

  const canEdit = (procurement) => {
    return procurement.requestStatus === 'pending' && 
           ['dosen', 'admin_lab'].includes(user?.role);
  };

  const canDelete = (procurement) => {
    return procurement.requestStatus === 'pending' && 
           ['dosen', 'admin_lab'].includes(user?.role);
  };

  const canUpdateStatus = (procurement) => {
    return procurement.requestStatus === 'pending' && user?.role === 'admin_jurusan';
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Disetujui', class: 'bg-green-100 text-green-800' },
      rejected: { label: 'Ditolak', class: 'bg-red-100 text-red-800' }
    };
    const s = config[status] || config.pending;
    return (
      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.class}`}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pengajuan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pengajuan Aset</h2>
              <p className="text-gray-600 mt-1">Kelola pengajuan pengadaan aset</p>
            </div>
            {['dosen', 'admin_lab'].includes(user?.role) && (
              <button
                onClick={openCreateModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buat Pengajuan
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari data pengajuan aset"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearchClick}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          {procurements.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pengajuan</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat pengajuan baru.</p>
              {['dosen', 'admin_lab'].includes(user?.role) && (
                <div className="mt-6">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Pengajuan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Aset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengaju
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {procurements.map((procurement) => (
                    <tr key={procurement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{procurement.assetName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{procurement.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{procurement.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{procurement.user?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(procurement.requestStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openDetailModal(procurement)}
                          className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {canUpdateStatus(procurement) && (
                          <button
                            onClick={() => openStatusModal(procurement)}
                            className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}

                        {canEdit(procurement) && (
                          <button
                            onClick={() => openEditModal(procurement)}
                            className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}

                        {canDelete(procurement) && (
                          <button
                            onClick={() => handleDelete(procurement.id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProcurementFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={formMode === 'create' ? handleCreate : handleUpdate}
        initialData={selectedProcurement}
        mode={formMode}
      />

      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSubmit={handleUpdateStatus}
        procurement={selectedProcurement}
      />

      <DetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        procurement={selectedProcurement}
      />
    </div>
  );
};

export default ProcurementRequestPage;