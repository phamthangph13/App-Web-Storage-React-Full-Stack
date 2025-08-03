# AppP2PExpo - Ứng dụng quản lý file với Expo

Ứng dụng React Native được xây dựng bằng Expo Go để quản lý file với backend Spring Boot.

## Tính năng

### Authentication
- ✅ Đăng nhập với email/password
- ✅ Đăng ký tài khoản mới
- ✅ Quên mật khẩu
- ✅ Đặt lại mật khẩu với token
- ✅ JWT Authentication
- ✅ Auto-login với AsyncStorage

### File Management
- ✅ Upload file từ thiết bị
- ✅ Upload ảnh từ thư viện
- ✅ Xem danh sách file đã upload
- ✅ Xóa file
- ✅ Refresh danh sách file
- ✅ Hiển thị thông tin file (kích thước, loại, ngày upload)

## Cài đặt

### Yêu cầu
- Node.js (v14 trở lên)
- npm hoặc yarn
- Expo CLI
- Expo Go app trên điện thoại

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình backend
Chỉnh sửa file `src/services/api.js` để thay đổi URL backend:
```javascript
const API_BASE_URL = 'http://your-backend-url:8080';
```

### Bước 3: Chạy ứng dụng
```bash
npx expo start
```

### Bước 4: Chạy trên thiết bị
1. Cài đặt Expo Go trên điện thoại
2. Quét QR code hiển thị trong terminal
3. Ứng dụng sẽ mở trên thiết bị của bạn

## Cấu trúc project

```
AppP2PExpo/
├── src/
│   ├── components/          # Components tái sử dụng
│   ├── context/            # React Context (AuthContext)
│   ├── navigation/         # Navigation setup
│   ├── screens/           # Các màn hình
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ForgotPasswordScreen.js
│   │   ├── ResetPasswordScreen.js
│   │   └── HomeScreen.js
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── fileService.js
│   └── utils/             # Utility functions
├── App.js                 # Entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/forgot-password` - Quên mật khẩu
- `POST /auth/reset-password` - Đặt lại mật khẩu
- `GET /auth/validate-reset-token` - Kiểm tra token

### File Management
- `POST /files/upload` - Upload file
- `GET /files/my-files` - Lấy danh sách file
- `GET /files/my-files/{fileType}` - Lấy file theo loại
- `GET /files/download/{fileId}` - Download file
- `GET /files/preview/{fileId}` - Preview file
- `DELETE /files/{fileId}` - Xóa file
- `GET /files/info/{fileId}` - Thông tin file
- `PUT /files/{fileId}/rename` - Đổi tên file

## Troubleshooting

### Lỗi kết nối backend
- Kiểm tra URL backend trong `src/services/api.js`
- Đảm bảo backend đang chạy
- Kiểm tra CORS settings trên backend

### Lỗi upload file
- Kiểm tra quyền truy cập file trên thiết bị
- Đảm bảo file không quá lớn
- Kiểm tra kết nối internet

### Lỗi authentication
- Kiểm tra email/password
- Đảm bảo backend đang chạy
- Kiểm tra JWT token

## Development

### Thêm màn hình mới
1. Tạo file trong `src/screens/`
2. Import và thêm vào navigation trong `src/navigation/AppNavigator.js`

### Thêm API mới
1. Tạo function trong service tương ứng
2. Import và sử dụng trong component

### Styling
- Sử dụng StyleSheet.create() cho styling
- Follow design system với colors và spacing nhất quán

## License

MIT License 