import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { VideoView, useVideoPlayer } from 'expo-video';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

const FileViewer = ({ visible, file, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUri, setFileUri] = useState(null);

  // Video player hook phải được gọi ở top level
  const videoPlayer = useVideoPlayer(fileUri || '', player => {
    if (fileUri) {
      player.loop = false;
    }
  });

  // useEffect phải được gọi trước bất kỳ return nào
  useEffect(() => {
    if (visible && file && file.id) {
      downloadFileToCache();
    } else {
      setFileUri(null);
      setError(null);
      setLoading(false);
    }
  }, [visible, file]);

  if (!file) return null;

  const getFileType = () => {
    const fileType = file.fileType?.toLowerCase() || '';
    const fileName = file.originalFileName?.toLowerCase() || '';
    
    if (fileType.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].some(ext => fileName.includes(ext))) {
      return 'image';
    }
    if (fileType.includes('video') || ['mp4', 'avi', 'mov', 'wmv', 'mkv'].some(ext => fileName.includes(ext))) {
      return 'video';
    }
    if (['pdf'].some(ext => fileName.includes(ext))) {
      return 'pdf';
    }
    if (['txt', 'md', 'json', 'xml', 'csv'].some(ext => fileName.includes(ext))) {
      return 'text';
    }
    return 'other';
  };

  const handleDownload = async () => {
    try {
      if (!fileUri) {
        Alert.alert('Lỗi', 'File chưa được tải');
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Thành công', 'File đã sẵn sàng để chia sẻ');
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Lỗi', 'Không thể chia sẻ file');
    }
  };

  const downloadFileToCache = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      const baseURL = api.defaults.baseURL || 'http://192.168.1.166:8080/api';
      const downloadUrl = `${baseURL}/files/preview/${file.id}`;
      
      const fileInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + file.originalFileName);
      if (fileInfo.exists) {
        setFileUri(fileInfo.uri);
        setLoading(false);
        return;
      }

      const downloadResult = await FileSystem.downloadAsync(
        downloadUrl,
        FileSystem.cacheDirectory + file.originalFileName,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (downloadResult.status === 200) {
        setFileUri(downloadResult.uri);
      } else {
        setError('Không thể tải file');
      }
    } catch (error) {
      console.error('Download file error:', error);
      setError('Lỗi khi tải file: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };



  const renderContent = () => {
    const fileType = getFileType();

    if (!file.id) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>Không thể tải file</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải file...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={downloadFileToCache}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!fileUri) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>Không thể tải file</Text>
        </View>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <ScrollView 
            contentContainerStyle={styles.imageContainer}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <Image
              source={{ uri: fileUri }}
              style={styles.image}
              contentFit="contain"
              onError={() => setError('Không thể tải ảnh')}
            />
          </ScrollView>
        );

      case 'video':
        return (
          <View style={styles.videoContainer}>
            <VideoView
              style={styles.video}
              player={videoPlayer}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        );

      case 'pdf':
        return (
          <WebView
            source={{ uri: fileUri }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            )}
            onError={() => setError('Không thể tải tài liệu')}
          />
        );

      case 'text':
        return (
          <WebView
            source={{ uri: fileUri }}
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            )}
            onError={() => setError('Không thể tải file text')}
          />
        );

      default:
        return (
          <View style={styles.unsupportedContainer}>
            <Ionicons name="document" size={64} color="#666" />
            <Text style={styles.unsupportedText}>Loại file không được hỗ trợ xem trực tiếp</Text>
            <Text style={styles.unsupportedSubtext}>Bạn có thể tải xuống để xem</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.fileName} numberOfLines={1}>
              {file.originalFileName}
            </Text>
            <Text style={styles.fileSize}>
              {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB` : ''}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.downloadButton} 
            onPress={handleDownload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            renderContent()
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center',
  },
  fileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  fileSize: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  downloadButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height - 100,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height - 100,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unsupportedText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  unsupportedSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FileViewer;