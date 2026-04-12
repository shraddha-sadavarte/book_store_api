import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookDetailPage from './pages/BookDetailPage'
import AdminDashboard from './pages/AdminDashboard'

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/home"      element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/admin"     element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

const RootRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && user?.role === 'admin' && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate('/admin', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (user?.role === 'admin') return null; // will be redirected by useEffect
  return <HomePage />;
};

export default App