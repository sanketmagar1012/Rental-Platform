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
    <div className="bg-transparent min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="glass-box rounded-lg max-w-md w-full p-8">
        
        <h2 className="text-2xl font-bold text-white mb-2 text-center drop-shadow">Login</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">Welcome back to RentSphere</p>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
             <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" placeholder="Enter your email" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
             <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" placeholder="Enter your password" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] font-bold py-3 rounded transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] mt-6">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don't have an account? <Link to="/register" className="text-[#38bdf8] font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
