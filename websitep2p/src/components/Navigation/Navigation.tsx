import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    token: string;
  };
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ userData, onLogout }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    onLogout();
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '🏠'
    },
    {
      path: '/home',
      label: 'Quản lý File',
      icon: '📁'
    }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon">🌐</span>
            <span className="brand-text">WebP2P</span>
          </Link>
        </div>

        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {(userData.firstName?.[0] || userData.email[0]).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">
                {userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData.email
                }
              </span>
              <span className="user-email">{userData.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;