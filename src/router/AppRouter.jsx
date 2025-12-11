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
          
          {/* Protected routes */}
          <Route
            path="/aset"
            element={
              <PrivateRoute>
                <AsetList />
              </PrivateRoute>
            }
          />
          
          {/* ← TAMBAHKAN ROUTE INI */}
          <Route
            path="/pengajuan"
            element={
              <PrivateRoute>
                <PengajuanList />
              </PrivateRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/aset" replace />} />
          <Route path="*" element={<Navigate to="/aset" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;