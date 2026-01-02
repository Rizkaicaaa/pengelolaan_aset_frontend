import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo aset.png";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Untuk mendeteksi halaman aktif

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin logout?')) {
      await logout();
      navigate('/login');
    }
  };

  // Function untuk menentukan apakah link aktif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  Sistem Aset DSI
                </h1>
              </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              <Link
                to="/aset"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/aset')
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Data Aset
              </Link>
              
              <Link
                to="/pengajuan"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/pengajuan')
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pengajuan Aset
              </Link>
            </div>

          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {user?.role || 'User'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;