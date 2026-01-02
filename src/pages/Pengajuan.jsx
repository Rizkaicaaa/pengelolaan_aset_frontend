import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import pengajuanService from '../services/pengajuanService';
import Navbar from '../components/Navbar';
import UnsplashModal from '../components/UnsplashModal'; 

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
    reason: '',
    image_reference: '' 
  });
  
  const [showUnsplashModal, setShowUnsplashModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        assetName: initialData.assetName || '',
        quantity: initialData.quantity || 1,
        category: initialData.category || 'electronics',
        reason: initialData.reason || '',
        image_reference: initialData.image_reference || '' // <--- Load gambar jika sedang Edit
      });
    } else {
      setFormData({
        assetName: '',
        quantity: 1,
        category: 'electronics',
        reason: '',
        image_reference: '' 
      });
    }
    setErrors({});
  }, [initialData, isOpen]);


  const handleSelectImage = (url) => {
    setFormData({ ...formData, image_reference: url });
    setShowUnsplashModal(false);
  };

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
    <>
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
              Foto Referensi (Opsional)
            </label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm"
                value={formData.image_reference}
                readOnly 
                placeholder="URL gambar..."
              />
              <button 
                type="button" 
                onClick={() => setShowUnsplashModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 whitespace-nowrap text-sm font-medium flex items-center gap-2"
              >
                <Search size={16} /> Cari Foto
              </button>
            </div>

            {/* Preview Gambar */}
            {formData.image_reference && (
              <div className="mt-2 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={formData.image_reference} 
                  alt="Preview Aset" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, image_reference: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}
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
    {/* 4. Render Modal Unsplash akan muncul menumpuk di atas modal form) */}
      {showUnsplashModal && (
        <UnsplashModal 
          onClose={() => setShowUnsplashModal(false)} 
          onSelectImage={handleSelectImage} 
        />
      )}
    </>
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
        {procurement.image_reference && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-500 block mb-1">Foto Referensi</label>
            <div className="h-48 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={procurement.image_reference} 
                alt={procurement.assetName} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
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
      setProcurements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => loadProcurements(searchTerm);

  const handleCreate = async (formData) => {
    await pengajuanService.create(formData);
    loadProcurements(searchTerm);
  };

  const handleUpdate = async (formData) => {
    await pengajuanService.update(selectedProcurement.id, formData);
    loadProcurements(searchTerm);
  };

  const handleUpdateStatus = async (statusData) => {
    await pengajuanService.updateStatus(selectedProcurement.id, statusData);
    loadProcurements(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengajuan ini?')) {
      await pengajuanService.delete(id);
      loadProcurements(searchTerm);
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

  const canEdit = (p) => p.requestStatus === 'pending' && ['dosen', 'admin_lab'].includes(user?.role);
  const canDelete = (p) => p.requestStatus === 'pending' && ['dosen', 'admin_lab'].includes(user?.role);
  const canUpdateStatus = (p) => p.requestStatus === 'pending' && user?.role === 'admin_jurusan';

  const getStatusBadge = (status) => {
    const config = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const label = { pending: 'Pending', approved: 'Disetujui', rejected: 'Ditolak' };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config[status] || config.pending}`}>
        {label[status] || 'Pending'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Pengajuan Aset</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Card Header dengan gradient */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Daftar Pengajuan</h2>
                <p className="text-blue-100 text-sm mt-1">Pantau dan kelola semua pengajuan aset</p>
              </div>
              {['dosen', 'admin_lab'].includes(user?.role) && (
                <button
                  onClick={openCreateModal}
                  className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Buat Pengajuan
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 lg:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari nama aset, kategori, atau pengaju..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 lg:mx-8 mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data pengajuan...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && procurements.length === 0 && (
            <div className="p-16 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada pengajuan</h3>
              <p className="mt-2 text-gray-500">Mulai dengan membuat pengajuan aset baru.</p>
              {['dosen', 'admin_lab'].includes(user?.role) && (
                <button
                  onClick={openCreateModal}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Buat Pengajuan
                </button>
              )}
            </div>
          )}

          {/* Table */}
          {!loading && procurements.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Aset</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pengaju</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gambar</th>
                    <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {procurements.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 lg:px-8 py-5 text-sm font-medium text-gray-900">{p.assetName}</td>
                      <td className="px-6 lg:px-8 py-5 text-sm text-gray-700">{p.quantity}</td>
                      <td className="px-6 lg:px-8 py-5 text-sm text-gray-700 capitalize">{p.category}</td>
                      <td className="px-6 lg:px-8 py-5 text-sm text-gray-700">{p.user?.name || '-'}</td>
                      <td className="px-6 lg:px-8 py-5">{getStatusBadge(p.requestStatus)}</td>
                      <td className="px-6 lg:px-8 py-5">{p.image_reference ? (
                          <div className="h-12 w-16 flex-shrink-0"><img 
                            src={p.image_reference} 
                            alt={p.assetName} 
                            className="h-full w-full object-cover rounded border border-gray-200 shadow-sm"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded">No Image</span>
                      )}
                      </td>
                      <td className="px-6 lg:px-8 py-5 text-sm space-x-3">
                        <button onClick={() => openDetailModal(p)} className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-5 h-5" />
                        </button>
                        {canUpdateStatus(p) && (
                          <button onClick={() => openStatusModal(p)} className="text-green-600 hover:text-green-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        {canEdit(p) && (
                          <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        {canDelete(p) && (
                          <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Modals - tetap sama */}
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