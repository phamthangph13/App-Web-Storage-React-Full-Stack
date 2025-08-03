import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  // Đăng nhập
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      if (response.data.success) {
        const { token, email: userEmail, firstName, lastName } = response.data.data;
        
        // Lưu token và thông tin user vào AsyncStorage
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify({
          email: userEmail,
          firstName,
          lastName,
        }));
        
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        return {
          success: false,
          message: response.data.message,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại',
      };
    }
  }

  // Đăng ký
  async register(email, password, confirmPassword, firstName = '', lastName = '') {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
      };
    }
  }

  // Quên mật khẩu
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Gửi email thất bại',
      };
    }
  }

  // Đặt lại mật khẩu
  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
        confirmPassword,
      });
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đặt lại mật khẩu thất bại',
      };
    }
  }

  // Kiểm tra token có hợp lệ không
  async validateResetToken(token) {
    try {
      const response = await api.get(`/auth/validate-reset-token?token=${token}`);
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Validate token error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Token không hợp lệ',
      };
    }
  }

  // Đăng xuất
  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  // Kiểm tra trạng thái đăng nhập
  async isLoggedIn() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('Check login status error:', error);
      return false;
    }
  }

  // Lấy thông tin user đã lưu
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }
}

export default new AuthService(); 