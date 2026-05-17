import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-mb-red py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
          Find your perfect rental home today
        </h1>
        
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <button onClick={() => navigate('/login')} className="bg-white text-mb-red rounded-full px-10 py-4 font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl">
            Browse Properties
          </button>
        </div>
      </div>

      {/* Services / Tiles Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">Because you searched Pune</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer" onClick={() => navigate('/login')}>
             <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
               <img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="home" className="w-8 opacity-50"/>
             </div>
             <h3 className="font-medium text-gray-800">Flats for Rent</h3>
             <p className="text-sm text-gray-500 mt-2">Find your ideal home easily</p>
           </div>
           
           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer" onClick={() => navigate('/login')}>
             <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
               <img src="https://cdn-icons-png.flaticon.com/512/2830/2830305.png" alt="shop" className="w-8 opacity-50"/>
             </div>
             <h3 className="font-medium text-gray-800">Commercial Shops</h3>
             <p className="text-sm text-gray-500 mt-2">Prime locations across city</p>
           </div>

           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer" onClick={() => navigate('/login')}>
             <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4">
               <img src="https://cdn-icons-png.flaticon.com/512/2275/2275607.png" alt="farmhouse" className="w-8 opacity-50"/>
             </div>
             <h3 className="font-medium text-gray-800">Farmhouses</h3>
             <p className="text-sm text-gray-500 mt-2">Weekend getaways nearby</p>
           </div>

           <div className="bg-[#fff9e6] border border-yellow-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center cursor-pointer" onClick={() => navigate('/login')}>
             <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
               <span className="text-2xl font-bold text-yellow-500">₹</span>
             </div>
             <h3 className="font-medium text-gray-800">Post Property Free</h3>
             <p className="text-sm text-gray-500 mt-2">Rent out your property</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
