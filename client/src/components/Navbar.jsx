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
    <nav className="sticky top-0 z-50 shrink-0 border-b border-white/10 bg-[#0f172a]/95 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-[#38bdf8] tracking-tight drop-shadow-md">
            RentSphere
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white">
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-white hover:bg-white/10 px-3 py-2 rounded-full transition-colors">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs mr-1">
                    {user.name.charAt(0)}
                  </div>
                  {user.name} <ChevronDown size={14}/>
                </div>
                
                <div className="absolute right-0 mt-1 w-48 glass-box border border-white/20 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2 border-b border-white/10">
                     <span className="block px-4 py-1 text-xs text-gray-400 uppercase">Logged in as {user.role}</span>
                  </div>
                  {user.role === 'owner' ? (
                    <Link to="/my-properties" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm text-white"><User size={16}/> Manage Properties</Link>
                  ) : (
                    <Link to="/properties" className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm text-white"><User size={16}/> My Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-sm text-red-400 text-left"><LogOut size={16}/> Logout</button>
                </div>
              </div>

              {user.role === 'owner' && (
                 <Link to="/my-properties" className="hidden md:inline-block bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] font-semibold text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all">
                   Post Property <span className="bg-[#0f172a] text-[#38bdf8] text-xs px-1 rounded ml-1 uppercase border border-[#38bdf8]">Free</span>
                 </Link>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white hover:text-[#38bdf8] transition-colors flex items-center gap-1">
                Login <ChevronDown size={14}/>
              </Link>
              <Link to="/login" className="hidden md:inline-block bg-[#38bdf8] hover:bg-sky-400 text-[#0f172a] font-semibold text-sm px-4 py-2 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all">
                 Post Property <span className="bg-[#0f172a] text-[#38bdf8] text-xs px-1 rounded ml-1 uppercase border border-[#38bdf8]">Free</span>
              </Link>
            </>
          )}
          
          <button className="md:hidden text-white hover:text-[#38bdf8]">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
