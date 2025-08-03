import api from './api';

class FileService {
  // Upload file
  async uploadFile(fileUri, fileName) {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/octet-stream', // Sẽ được detect tự động
        name: fileName,
      });

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Upload file error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Upload file thất bại',
      };
    }
  }

  // Lấy danh sách file của user
  async getMyFiles() {
    try {
      const response = await api.get('/files/my-files');
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get my files error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy danh sách file thất bại',
      };
    }
  }

  // Lấy danh sách file theo loại
  async getMyFilesByType(fileType) {
    try {
      const response = await api.get(`/files/my-files/${fileType}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get files by type error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy danh sách file thất bại',
      };
    }
  }

  // Download file
  async downloadFile(fileId) {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: 'blob',
      });
      
      return {
        success: true,
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      console.error('Download file error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Download file thất bại',
      };
    }
  }

  // Preview file
  async previewFile(fileId) {
    try {
      const response = await api.get(`/files/preview/${fileId}`, {
        responseType: 'blob',
      });
      
      return {
        success: true,
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      console.error('Preview file error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Preview file thất bại',
      };
    }
  }

  // Xóa file
  async deleteFile(fileId) {
    try {
      const response = await api.delete(`/files/${fileId}`);
      
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Delete file error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Xóa file thất bại',
      };
    }
  }

  // Lấy thông tin file
  async getFileInfo(fileId) {
    try {
      const response = await api.get(`/files/info/${fileId}`);
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Get file info error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lấy thông tin file thất bại',
      };
    }
  }

  // Đổi tên file
  async renameFile(fileId, newFileName) {
    try {
      const response = await api.put(`/files/${fileId}/rename`, null, {
        params: { newFileName },
      });
      
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Rename file error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đổi tên file thất bại',
      };
    }
  }
}

export default new FileService(); 