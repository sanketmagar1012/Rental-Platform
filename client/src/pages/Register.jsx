import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'owner' ? '/my-properties' : '/properties');
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
      const res = await register(formData);
      contextLogin(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="glass-box rounded-lg max-w-md w-full p-8">
        
        <h2 className="text-2xl font-bold text-white mb-2 text-center drop-shadow">Create an Account</h2>
        <p className="text-gray-300 text-sm mb-6 text-center">Join RentSphere today</p>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">I am a...</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 cursor-pointer p-3 border rounded flex-1 justify-center transition-all ${formData.role === 'user' ? 'bg-[#38bdf8]/20 border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'border-white/20 hover:bg-white/10'}`}>
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="hidden" />
                <span className="text-sm font-medium text-white">Tenant/Buyer</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer p-3 border rounded flex-1 justify-center transition-all ${formData.role === 'owner' ? 'bg-[#38bdf8]/20 border-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.2)]' : 'border-white/20 hover:bg-white/10'}`}>
                <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} className="hidden" />
                <span className="text-sm font-medium text-white">Property Owner</span>
              </label>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
             <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
             <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
             <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
             <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-white/10 border border-white/20 text-white rounded px-3 py-2 outline-none focus:border-[#38bdf8] focus:bg-white/20 transition-all placeholder-gray-400" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] font-bold py-3 rounded transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] mt-6">
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account? <Link to="/login" className="text-[#38bdf8] font-medium hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
