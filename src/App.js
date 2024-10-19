import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WhatsAppAuth from './components/WhatsAppAuth';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhatsAppAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;