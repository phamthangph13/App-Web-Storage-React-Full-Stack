import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình base URL cho backend
const API_BASE_URL = 'http://192.168.1.166:8080/api'; // Thêm context path /api

// Tạo instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      // Có thể redirect về màn hình login ở đây
    }
    return Promise.reject(error);
  }
);

export default api; 