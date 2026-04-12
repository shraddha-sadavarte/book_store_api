import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">📚 Bookstore</Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">Home</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-600 hover:text-blue-600 text-sm">Dashboard</Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar