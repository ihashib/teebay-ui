import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddProductWizard from './pages/AddProductWizard';
import EditProduct from './pages/EditProduct';
import BuyProduct from './pages/BuyProduct'; 
import RentProduct from './pages/RentProduct'; 
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/products/add" element={<ProtectedRoute><AddProductWizard /></ProtectedRoute>} />

      <Route
        path="/products/edit/:productId"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/buy/:productId"
        element={
          <ProtectedRoute>
            <BuyProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/rent/:productId"
        element={
          <ProtectedRoute>
            <RentProduct />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
