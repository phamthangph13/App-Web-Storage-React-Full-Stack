# BIỂU ĐỒ UML CHO HỆ THỐNG P2P

## Tổng quan
Dự án P2P (Peer-to-Peer) với hệ thống xác thực bao gồm các thành phần chính:
- **Frontend**: Mobile App (React Native/Expo) + Website (React/TypeScript)
- **Backend**: Spring Boot với JWT Authentication
- **Database**: MongoDB
- **Infrastructure**: Docker + Nginx

## Danh sách biểu đồ UML

### 1. BIỂU ĐỒ USE CASE

#### 1.1. Use Case Tổng Quát
- **File**: `UseCase_General.puml`
- **Mô tả**: Tổng quan tất cả use case của hệ thống
- **Các actor chính**: Người dùng, Quản trị viên, Hệ thống Email
- **Use case chính**: Đăng ký, Đăng nhập, Quản lý file, Xác thực

#### 1.2. Use Case Phân Rã - Xác thực
- **File**: `UseCase_Auth_Detailed.puml`
- **Mô tả**: Chi tiết các use case liên quan đến xác thực
- **Các use case con**:
  - Đăng ký tài khoản (validate, hash password, lưu DB)
  - Đăng nhập (xác thực, tạo JWT, trả về token)
  - Quên mật khẩu (tạo token, gửi email)
  - Đặt lại mật khẩu (validate token, cập nhật password)

#### 1.3. Use Case Phân Rã - Quản lý File
- **File**: `UseCase_File_Detailed.puml`
- **Mô tả**: Chi tiết các use case liên quan đến quản lý file
- **Các use case con**:
  - Upload file (validate, lưu storage, tạo metadata)
  - Download file (xác thực quyền, stream file)
  - Xem danh sách file (lọc, sắp xếp, phân trang)
  - Xóa file (xác thực quyền, xóa storage + metadata)
  - Preview file (hỗ trợ image, video, PDF)

### 2. BIỂU ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAM)

#### 2.1. Quy trình Đăng nhập
- **File**: `Activity_Login.puml`
- **Mô tả**: Luồng xử lý đăng nhập từ frontend đến backend
- **Các bước chính**:
  - Validate input data
  - Tìm user trong database
  - So sánh password đã hash
  - Tạo JWT token
  - Lưu token vào localStorage

#### 2.2. Quy trình Upload File
- **File**: `Activity_UploadFile.puml`
- **Mô tả**: Luồng xử lý upload file với đầy đủ validation
- **Các bước chính**:
  - Validate file type và size
  - Kiểm tra dung lượng còn lại
  - Lưu file vào storage
  - Tạo metadata trong database
  - Trả về response

#### 2.3. Quy trình Quên Mật khẩu
- **File**: `Activity_ForgotPassword.puml`
- **Mô tả**: Luồng xử lý quên mật khẩu với email reset
- **Các bước chính**:
  - Validate email
  - Tạo reset token
  - Lưu token vào database
  - Gửi email reset
  - Xử lý lỗi và rollback

### 3. BIỂU ĐỒ TIẾN TRÌNH (SEQUENCE DIAGRAM)

#### 3.1. Luồng Xác thực
- **File**: `Sequence_Auth.puml`
- **Mô tả**: Tương tác giữa các component trong quá trình xác thực
- **Các luồng chính**:
  - Đăng nhập (login)
  - Đăng ký (register)
  - Quên mật khẩu (forgot password)
  - Đặt lại mật khẩu (reset password)

#### 3.2. Luồng Quản lý File
- **File**: `Sequence_FileManagement.puml`
- **Mô tả**: Tương tác giữa các component trong quản lý file
- **Các luồng chính**:
  - Upload file
  - Download file
  - Lấy danh sách file
  - Xóa file
  - Preview file

### 4. BIỂU ĐỒ LUỒNG DỮ LIỆU (DATA FLOW DIAGRAM)

#### 4.1. Luồng Dữ liệu Tổng thể
- **File**: `DataFlow.puml`
- **Mô tả**: Luồng dữ liệu trong toàn bộ hệ thống
- **Các thành phần chính**:
  - External entities: User, Email Server
  - Processes: Frontend, Controllers, Services
  - Data stores: UserDB, FileDB, FileStorage, TokenDB
- **Các luồng chính**:
  - Authentication flow (1-12)
  - Password reset flow (13-23)
  - File upload flow (24-36)
  - File download flow (37-49)
  - File list flow (50-60)

## Cách sử dụng

### 1. Xem biểu đồ
- Sử dụng PlantUML plugin trong IDE
- Hoặc sử dụng online PlantUML editor
- Hoặc chạy lệnh: `plantuml *.puml`

### 2. Cập nhật biểu đồ
- Chỉnh sửa file `.puml` tương ứng
- Regenerate diagram
- Cập nhật documentation

### 3. Export biểu đồ
- PNG: `plantuml -tpng *.puml`
- SVG: `plantuml -tsvg *.puml`
- PDF: `plantuml -tpdf *.puml`

## Kiến trúc hệ thống

### Frontend
- **Mobile App**: React Native với Expo
- **Website**: React với TypeScript
- **State Management**: Context API
- **Navigation**: React Navigation (Mobile) / React Router (Web)

### Backend
- **Framework**: Spring Boot
- **Security**: JWT Authentication
- **Database**: MongoDB
- **File Storage**: Local file system (có thể mở rộng sang S3)

### Infrastructure
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **Orchestration**: Docker Compose

## Bảo mật

### Authentication
- JWT token với expiration
- Password hashing với BCrypt
- Secure token storage

### Authorization
- Role-based access control
- File ownership validation
- API endpoint protection

### Data Protection
- Input validation
- File type validation
- Size limit enforcement
- SQL injection prevention

## Monitoring & Logging

### Application Logs
- Spring Boot logging
- Request/Response logging
- Error tracking

### Performance Metrics
- API response time
- File upload/download speed
- Database query performance

## Deployment

### Development
- Docker Compose với hot reload
- Local MongoDB instance
- Development environment variables

### Production
- Docker containers
- Nginx reverse proxy
- SSL/TLS encryption
- Database backup strategy

---

**Lưu ý**: Tất cả biểu đồ UML được tạo bằng PlantUML và có thể được chỉnh sửa dễ dàng. Các biểu đồ này phản ánh kiến trúc và luồng xử lý của hệ thống P2P một cách chi tiết và đầy đủ. 