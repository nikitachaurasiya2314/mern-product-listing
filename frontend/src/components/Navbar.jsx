import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-dark sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-primary font-bold text-xl no-underline">
          🛒 ShopMERN
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-white text-sm hover:text-primary transition-colors">
            Products
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-yellow-400 text-sm font-semibold hover:text-yellow-300 transition-colors"
                >
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
              <Link to="/login" className="text-white text-sm hover:text-primary transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white text-sm px-3 py-1.5 rounded-md hover:opacity-90 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
