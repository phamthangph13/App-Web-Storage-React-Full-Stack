// API Service for WebP2P Application

const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  resetPassword: async (token: string, newPassword: string, confirmPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
    return handleResponse(response);
  },

  validateResetToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate-reset-token?token=${token}`);
    return handleResponse(response);
  },

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/health`);
    return handleResponse(response);
  }
};

// File API
export const fileAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return handleResponse(response);
  },

  getMyFiles: async () => {
    const response = await fetch(`${API_BASE_URL}/files/my-files`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getMyFilesByType: async (fileType: string) => {
    const response = await fetch(`${API_BASE_URL}/files/my-files/${fileType}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  download: (fileId: string) => {
    const token = localStorage.getItem('authToken');
    return `${API_BASE_URL}/files/download/${fileId}?token=${token}`;
  },

  preview: (fileId: string) => {
    const token = localStorage.getItem('authToken');
    return `${API_BASE_URL}/files/preview/${fileId}?token=${token}`;
  },

  delete: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getInfo: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/files/info/${fileId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  rename: async (fileId: string, newFileName: string) => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/rename?newFileName=${encodeURIComponent(newFileName)}`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface FileUploadResponse {
  id: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  firstName?: string;
  lastName?: string;
  expiresAt: string;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  gridFsId: string;
}

export default {
  auth: authAPI,
  file: fileAPI
};