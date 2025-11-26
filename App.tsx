
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FluidBackground from './components/canvas/FluidBackground';
import Navbar from './components/Navbar';
import GayaChat from './components/GayaChat';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
// import AuthCallback from './pages/AuthCallback';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Admin from './pages/Admin';
import UserDashboard from './pages/UserDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen text-white overflow-hidden selection:bg-white/30">
          <FluidBackground />
          
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>

          <GayaChat />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
