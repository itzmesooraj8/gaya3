
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import FluidBackground from './components/canvas/FluidBackground';
import Navbar from './components/Navbar';
import GayaChat from './components/GayaChat';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen text-white overflow-hidden selection:bg-white/30">
          <FluidBackground />
          
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Routes>

          <GayaChat />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
