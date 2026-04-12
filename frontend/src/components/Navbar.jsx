import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }
  const isActive = (path) => location.pathname === path

  const navLinks = user?.role === 'admin'
    ? [{ to: '/admin', label: 'Dashboard' }, { to: '/home', label: 'Browse Store' }]
    : [{ to: '/', label: 'Home' }]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Bookstore
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`text-sm font-medium transition ${isActive(to) ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop user actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="text-sm bg-red-50 text-red-500 border border-red-100 px-4 py-1.5 rounded-lg hover:bg-red-100 transition font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Login</Link>
              <Link to="/register" className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition"
          onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 flex flex-col gap-1">
            <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-2 transition ${isActive(to) ? 'text-blue-600' : 'text-gray-600'}`}>
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-1">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="text-sm bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-lg font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm border border-gray-200 text-gray-600 py-2 rounded-lg font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded-lg font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar