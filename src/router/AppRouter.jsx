import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Import pages
import Login from '../pages/Login';
import AsetList from '../pages/Aset';
import PengajuanList from '../pages/Pengajuan'; // ← TAMBAHKAN INI

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />
          
  
  
          <Route
            path="/pengajuan"
            element={
              <PrivateRoute>
                <PengajuanList />
              </PrivateRoute>
            }
          />
          
          {/* Default redirect */}
         <Route path="/" element={<Navigate to="/pengajuan" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;