import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import fileService from '../services/fileService';
import FileViewer from '../components/FileViewer';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ navigation }) => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery, selectedCategory]);

  const filterFiles = () => {
    let filtered = files;
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(file => {
        const fileType = file.fileType.toLowerCase();
        switch (selectedCategory) {
          case 'images':
            return fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].some(ext => fileType.includes(ext));
          case 'documents':
            return ['pdf', 'doc', 'docx', 'txt', 'rtf'].some(ext => fileType.includes(ext));
          case 'videos':
            return fileType.includes('video') || ['mp4', 'avi', 'mov', 'wmv'].some(ext => fileType.includes(ext));
          case 'others':
            return !(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'doc', 'docx', 'txt', 'rtf', 'mp4', 'avi', 'mov', 'wmv'].some(ext => fileType.includes(ext)) || fileType.includes('image') || fileType.includes('video'));
          default:
            return true;
        }
      });
    }
    
    setFilteredFiles(filtered);
  };

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const result = await fileService.getMyFiles();
      if (result.success) {
        setFiles(result.data || []);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách file');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiles();
    setRefreshing(false);
  };

  const handleRenameFile = (file) => {
    setSelectedFile(file);
    setNewFileName(file.originalFileName);
    setRenameModalVisible(true);
  };

  const confirmRename = async () => {
    if (!newFileName.trim()) {
      Alert.alert('Lỗi', 'Tên file không được để trống');
      return;
    }
    
    try {
      // Assuming fileService has a rename method
      const result = await fileService.renameFile(selectedFile.id, newFileName);
      if (result.success) {
        Alert.alert('Thành công', 'Đổi tên file thành công');
        loadFiles();
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đổi tên file');
    }
    
    setRenameModalVisible(false);
    setSelectedFile(null);
    setNewFileName('');
  };

  const handleViewFile = (file) => {
    setViewingFile(file);
    setViewerVisible(true);
  };

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        await uploadFile(file.uri, file.name);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn file');
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `image_${Date.now()}.jpg`;
        await uploadFile(asset.uri, fileName);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const uploadFile = async (fileUri, fileName) => {
    try {
      const result = await fileService.uploadFile(fileUri, fileName);
      if (result.success) {
        Alert.alert('Thành công', 'File đã được upload thành công!');
        loadFiles(); // Reload danh sách
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Upload file thất bại');
    }
  };

  const handleDeleteFile = async (fileId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa file này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await fileService.deleteFile(fileId);
              if (result.success) {
                Alert.alert('Thành công', 'File đã được xóa!');
                loadFiles(); // Reload danh sách
              } else {
                Alert.alert('Lỗi', result.message);
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Xóa file thất bại');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase() || '';
    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].some(ext => type.includes(ext))) {
      return 'image';
    }
    if (type.includes('video') || ['mp4', 'avi', 'mov', 'wmv'].some(ext => type.includes(ext))) {
      return 'videocam';
    }
    if (['pdf'].some(ext => type.includes(ext))) {
      return 'document-text';
    }
    if (['doc', 'docx'].some(ext => type.includes(ext))) {
      return 'document';
    }
    if (['txt', 'md'].some(ext => type.includes(ext))) {
      return 'document-outline';
    }
    return 'folder';
  };

  const renderFileItem = ({ item }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileIconContainer}>
        <Ionicons 
          name={getFileIcon(item.fileType)} 
          size={32} 
          color="#007AFF" 
        />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={2}>{item.originalFileName}</Text>
        <Text style={styles.fileDetails}>
          <Text>{formatFileSize(item.fileSize)}</Text>
          <Text> • </Text>
          <Text>{item.fileType}</Text>
        </Text>
        <Text style={styles.fileDate}>{formatDate(item.uploadedAt)}</Text>
      </View>
      <View style={styles.fileActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewFile(item)}
        >
          <Ionicons name="eye" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.renameButton]}
          onPress={() => handleRenameFile(item)}
        >
          <Ionicons name="create" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteFile(item.id)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="folder" size={28} color="#fff" />
            <Text style={styles.headerTitle}>Quản lý File</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="cloud-upload" size={20} color="#333" /> Upload File
        </Text>
        <View style={styles.uploadButtons}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFile}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.uploadButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="document" size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Chọn File</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              style={styles.uploadButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="image" size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Chọn Ảnh</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm file..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>Danh mục:</Text>
        <View style={styles.categoryButtons}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'images', label: 'Hình ảnh' },
            { key: 'documents', label: 'Tài liệu' },
            { key: 'videos', label: 'Video' },
            { key: 'others', label: 'Khác' }
          ].map(category => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.selectedCategoryButtonText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.filesSection}>
        <Text style={styles.sectionTitle}>
          <Text>Danh sách File (</Text>
          <Text>{filteredFiles.length}</Text>
          <Text>/</Text>
          <Text>{files.length}</Text>
          <Text>)</Text>
        </Text>
        <FlatList
          data={filteredFiles}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có file nào</Text>
            </View>
          }
        />      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi tên file</Text>
            <TextInput
              style={styles.modalInput}
              value={newFileName}
              onChangeText={setNewFileName}
              placeholder="Nhập tên file mới"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmRename}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FileViewer
        visible={viewerVisible}
        file={viewingFile}
        onClose={() => {
          setViewerVisible(false);
          setViewingFile(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  uploadSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  uploadButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  filesSection: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 22,
  },
  fileDetails: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: '#3b82f6',
  },
  renameButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  searchSection: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  categorySection: {
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedCategoryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: 0.3,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  confirmButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;