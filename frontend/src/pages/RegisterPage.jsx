import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); dispatch(registerUser(form)); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-9 w-full max-w-md">
        <h1 className="text-dark font-bold text-3xl mb-1">Create Account 🚀</h1>
        <p className="text-gray-400 text-sm mb-6">Join ShopMERN today as a user</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Full Name</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="John Doe"
              className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>

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
              required minLength={6} placeholder="Min 6 characters"
              className="px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5">
            <span className="text-blue-500 text-sm">👤</span>
            <span className="text-xs text-blue-600 font-medium">
              All new accounts are registered as <strong>User</strong>.
              Admin accounts are managed separately.
            </span>
          </div>

          <button
            type="submit" disabled={loading}
            className="mt-1 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer border-0"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
