import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import './App.css';

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  token: string;
  expiresAt: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        // Check if token is still valid
        const expiryTime = new Date(parsedUserData.expiresAt);
        const currentTime = new Date();
        
        if (expiryTime > currentTime) {
          setIsAuthenticated(true);
          setUserData(parsedUserData);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      } catch (error) {
        // Invalid stored data, clear storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: UserData) => {
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {isAuthenticated && userData ? (
            <>
              <Route 
                path="/dashboard" 
                element={<Dashboard userData={userData} onLogout={handleLogout} />} 
              />
              <Route 
                path="/home" 
                element={<Home userData={userData} onLogout={handleLogout} />} 
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          ) : (
            <>
              <Route 
                path="/login" 
                element={<Login onLogin={handleLogin} />} 
              />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
