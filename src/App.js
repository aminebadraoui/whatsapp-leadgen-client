import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import WhatsAppAuth from './components/WhatsAppAuth';
import Dashboard from './components/Dashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [isWhatsAppAuthenticated, setIsWhatsAppAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const whatsappAuth = localStorage.getItem('whatsappAuthenticated');
    if (token) {
      // Verify token with the server and set user
      // This is a placeholder and should be implemented
      // setUser({ id: '1', email: 'user@example.com' });
    }
    if (whatsappAuth === 'true') {
      setIsWhatsAppAuthenticated(true);
    }
  }, []);

  const handleWhatsAppAuth = () => {
    setIsWhatsAppAuthenticated(true);
    localStorage.setItem('whatsappAuthenticated', 'true');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/access"
          element={user ? <Navigate to="/whatsapp-auth" /> : <Login />}
        />
        <Route
          path="/whatsapp-auth"
          element={
            user ? (
              <WhatsAppAuth onAuthenticated={handleWhatsAppAuth} />
            ) : (
              <Navigate to="/access" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user && isWhatsAppAuthenticated ? (
              <Dashboard user={user} />
            ) : (
              <Navigate to={user ? '/whatsapp-auth' : '/access'} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;