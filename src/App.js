import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import WhatsAppAuth from './components/WhatsAppAuth';
import Dashboard from './components/Dashboard';
import Success from './components/Success';
import AuthPage from './components/AuthPage';
import useUserStore from './stores/userStore';

const App = () => {
  const userStore = useUserStore();
  const { user, setUser } = userStore;

  const initializeUser = useUserStore(state => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/success" element={<Success />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/access"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to={'/access'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;