import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './Auth.css';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setError('Token không hợp lệ');
      setValidatingToken(false);
    }
  }, [searchParams]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const result = await authAPI.validateResetToken(tokenToValidate);

      if (result.success) {
        setTokenValid(true);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setValidatingToken(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.resetPassword(token, formData.newPassword, formData.confirmPassword);

      if (result.success) {
        setSuccess('Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Đang xác thực...</h2>
            <p>Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Token không hợp lệ</h2>
            <p>{error || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn'}</p>
          </div>
          <div className="auth-links">
            <p>
              <Link to="/forgot-password">Yêu cầu link mới</Link> hoặc <Link to="/login">Quay lại đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đặt lại mật khẩu</h2>
          <p>Nhập mật khẩu mới của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu mới"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            <Link to="/login">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;