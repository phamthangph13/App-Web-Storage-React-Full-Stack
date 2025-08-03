import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import './Dashboard.css';

interface DashboardProps {
  userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    token: string;
    expiresAt: string;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    onLogout();
  };

  const formatExpiryTime = (expiresAt: string) => {
    try {
      const date = new Date(expiresAt);
      return date.toLocaleString('vi-VN');
    } catch {
      return 'Không xác định';
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation userData={userData} onLogout={onLogout} />

      <main className="dashboard-main">
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>Chào mừng trở lại!</h2>
            <div className="user-info">
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{userData.email}</span>
              </div>
              {userData.firstName && (
                <div className="info-item">
                  <span className="label">Họ:</span>
                  <span className="value">{userData.firstName}</span>
                </div>
              )}
              {userData.lastName && (
                <div className="info-item">
                  <span className="label">Tên:</span>
                  <span className="value">{userData.lastName}</span>
                </div>
              )}
              <div className="info-item">
                <span className="label">Token hết hạn:</span>
                <span className="value">{formatExpiryTime(userData.expiresAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3>Tính năng có sẵn</h3>
          <div className="features-grid">
            <Link to="/home" className="feature-card clickable">
              <div className="feature-icon">📁</div>
              <h4>Quản lý File</h4>
              <p>Upload, download và quản lý file của bạn</p>
              <div className="feature-status available">Có sẵn</div>
            </Link>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h4>P2P Connection</h4>
              <p>Kết nối trực tiếp giữa các thiết bị</p>
              <div className="feature-status coming-soon">Sắp có</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h4>Real-time Chat</h4>
              <p>Trò chuyện thời gian thực</p>
              <div className="feature-status coming-soon">Sắp có</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h4>End-to-End Encryption</h4>
              <p>Bảo mật đầu cuối</p>
              <div className="feature-status coming-soon">Sắp có</div>
            </div>
          </div>
        </div>

        <div className="status-section">
          <div className="status-card">
            <h4>Trạng thái hệ thống</h4>
            <div className="status-item">
              <span className="status-indicator online"></span>
              <span>Authentication Service: Online</span>
            </div>
            <div className="status-item">
              <span className="status-indicator pending"></span>
              <span>P2P Service: Đang phát triển</span>
            </div>
            <div className="status-item">
              <span className="status-indicator pending"></span>
              <span>File Service: Đang phát triển</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;