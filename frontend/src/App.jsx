import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './utils/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import UploadBill from './pages/UploadBill'
import BillDetail from './pages/BillDetail'
import Users from './pages/Users'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/"               element={<Dashboard />} />
            <Route path="/projects"        element={<Projects />} />
            <Route path="/projects/:id"    element={<ProjectDetail />} />
            <Route path="/bills/upload"    element={<UploadBill />} />
            <Route path="/bills/:id"       element={<BillDetail />} />
            <Route path="/users"            element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
