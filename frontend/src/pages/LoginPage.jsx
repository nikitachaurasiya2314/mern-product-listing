import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(form)); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-9 w-full max-w-md">
        <h1 className="text-dark font-bold text-3xl mb-1">Welcome Back 👋</h1>
        <p className="text-gray-400 text-sm mb-5">Login to your account</p>

        {/* Demo credentials */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-5 text-xs leading-relaxed text-gray-600">
          <strong>Demo Credentials:</strong><br />
          Admin: admin@example.com / admin123<br />
          User:&nbsp; user@example.com&nbsp; / user1234
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              required placeholder="you@example.com"
              className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handleChange}
              required placeholder="••••••••"
              className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="mt-1 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer border-0"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
