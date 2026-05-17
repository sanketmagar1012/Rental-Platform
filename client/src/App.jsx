import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import PropertyDetail from './pages/PropertyDetail';

// Pages placeholders for incomplete ones
const CompleteProfile = () => <div className="container mx-auto px-4 mt-4 text-center py-20"><h1>Complete Profile</h1></div>;

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            
            {/* Protected Routes Example */}
            <Route path="/my-properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
            <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><div>Favorites</div></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><div>Messages</div></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><div>Notifications</div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><div>Profile</div></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
