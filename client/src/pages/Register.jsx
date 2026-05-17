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
    <div className="bg-mb-gray min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full p-8">
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Create an Account</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">Join RentSphere today</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded flex-1 justify-center hover:bg-gray-50">
                <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} />
                <span className="text-sm font-medium text-gray-700">Tenant/Buyer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 border rounded flex-1 justify-center hover:bg-gray-50">
                <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} />
                <span className="text-sm font-medium text-gray-700">Property Owner</span>
              </label>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
             <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
             <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
             <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} pattern="[0-9]{10}" title="Please enter a valid 10-digit mobile number" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-mb-red" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-mb-red hover:bg-red-700 text-white font-medium py-3 rounded transition-colors mt-6">
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <Link to="/login" className="text-mb-red font-medium hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
