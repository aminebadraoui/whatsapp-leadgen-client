import React, { useState } from 'react';
import './App.css';
import WhatsAppAuth from './components/WhatsAppAuth';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <WhatsAppAuth onAuthenticated={handleAuthenticated} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;