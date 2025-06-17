import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AddProductWizard from './pages/AddProductWizard'
import EditProduct from './pages/EditProduct'
import History from './pages/History'
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

      <Route
        path="/products/add"
        element={
          <ProtectedRoute>
            <AddProductWizard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/edit/:productId"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
