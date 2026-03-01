import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-dark sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-primary font-bold text-xl no-underline">
          🛒 ShopMERN
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
          <Link to="/" className="text-white text-sm hover:text-primary transition-colors">
            Products
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition-colors">
                  Admin Panel
                </Link>
              )}
              <span className="text-gray-400 text-sm">👤 {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-primary text-white text-sm px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity cursor-pointer border-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white text-sm hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-white text-sm px-3 py-1.5 rounded-md hover:opacity-90 transition-colors">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white text-2xl bg-transparent border-0 cursor-pointer leading-none"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-dark border-t border-gray-700 px-4 py-3 flex flex-col gap-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-white text-sm hover:text-primary transition-colors">
            Products
          </Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-yellow-400 text-sm font-semibold">
                  Admin Panel
                </Link>
              )}
              <span className="text-gray-400 text-sm">👤 {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-primary text-white text-sm px-3 py-2 rounded-md hover:opacity-90 cursor-pointer border-0 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white text-sm hover:text-primary transition-colors">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-primary text-white text-sm px-3 py-2 rounded-md text-center">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
