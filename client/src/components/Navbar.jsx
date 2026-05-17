import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, ChevronDown, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-mb-red tracking-tight">
            RentSphere
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-mb-text">
            <Link to="/properties" className="hover:text-mb-red transition-colors flex items-center gap-1">Rent <ChevronDown size={14}/></Link>
            <span className="hover:text-mb-red transition-colors cursor-pointer flex items-center gap-1">Buy <ChevronDown size={14}/></span>
            <span className="hover:text-mb-red transition-colors cursor-pointer flex items-center gap-1">Sell <ChevronDown size={14}/></span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-mb-text hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs mr-1">
                    {user.name.charAt(0)}
                  </div>
                  {user.name} <ChevronDown size={14}/>
                </div>
                
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2 border-b border-gray-100">
                     <span className="block px-4 py-1 text-xs text-gray-500 uppercase">Logged in as {user.role}</span>
                  </div>
                  {user.role === 'owner' ? (
                    <Link to="/my-properties" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm"><User size={16}/> Manage Properties</Link>
                  ) : (
                    <Link to="/properties" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm"><User size={16}/> My Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-red-600 text-left"><LogOut size={16}/> Logout</button>
                </div>
              </div>

              {user.role === 'owner' && (
                 <Link to="/my-properties" className="hidden md:inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-4 py-2 rounded-full shadow-sm transition-colors">
                   Post Property <span className="bg-white text-xs px-1 rounded ml-1 uppercase border border-yellow-500">Free</span>
                 </Link>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-mb-red transition-colors flex items-center gap-1">
                Login <ChevronDown size={14}/>
              </Link>
              <Link to="/login" className="hidden md:inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-4 py-2 rounded-full shadow-sm transition-colors">
                 Post Property <span className="bg-white text-xs px-1 rounded ml-1 uppercase border border-yellow-500">Free</span>
              </Link>
            </>
          )}
          
          <button className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
