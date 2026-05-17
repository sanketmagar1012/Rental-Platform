import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        navigate('/my-properties');
      } else {
        navigate('/properties');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await loginService(formData);
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mb-gray min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full p-8">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Login</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Welcome back to RentSphere</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
             <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-mb-red hover:bg-red-700 text-white font-medium py-3 rounded transition-colors mt-6">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-mb-red font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
