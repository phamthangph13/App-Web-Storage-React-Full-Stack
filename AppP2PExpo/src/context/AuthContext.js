import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      if (isLoggedIn) {
        const userData = await authService.getUserData();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Check auth status error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.data);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Đăng nhập thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, confirmPassword, firstName, lastName) => {
    try {
      setIsLoading(true);
      const result = await authService.register(email, password, confirmPassword, firstName, lastName);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Đăng ký thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Gửi email thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
      setIsLoading(true);
      const result = await authService.resetPassword(token, newPassword, confirmPassword);
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Đặt lại mật khẩu thất bại' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    user,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 