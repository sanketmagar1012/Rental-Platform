import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProperties, deleteProperty } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import { PlusCircle } from 'lucide-react';

const MyProperties = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProps = async () => {
      try {
        const res = await getProperties({ ownerId: user._id });
        setProperties(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user._id) {
       fetchMyProps();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter(p => p._id !== id));
      } catch (error) {
        console.error('Failed to delete property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  return (
    <div className="bg-mb-gray min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-800">My Properties Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your listings and incoming leads</p>
          </div>
          <Link to="/add-property" className="bg-mb-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded shadow-md flex items-center gap-2 transition-colors">
            <PlusCircle size={20}/> Add New Property
          </Link>
        </div>

        {loading ? (
           <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mb-red"></div></div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200 shadow-sm">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle size={32} className="text-gray-400"/>
             </div>
             <h3 className="text-xl font-medium text-gray-800 mb-2">No properties listed yet</h3>
             <p className="text-gray-500 mb-6">Start earning by listing your flat, shop, or farmhouse for rent.</p>
             <Link to="/add-property" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-8 rounded shadow-sm transition-colors">
               Post your first property
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
             {properties.map(prop => (
               <div key={prop._id} className="relative">
                 <PropertyCard property={prop} />
                 <div className="absolute top-4 right-4 flex gap-2">
                   <button onClick={() => handleDelete(prop._id)} className="bg-white border border-red-300 text-red-600 text-xs font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors">Delete</button>
                 </div>
               </div>
             ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyProperties;
