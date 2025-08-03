# AppP2P Authentication Service

Backend service cho ứng dụng AppP2P, cung cấp các API authentication bao gồm đăng ký, đăng nhập và quên mật khẩu.

## Công nghệ sử dụng

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **MongoDB**
- **JWT (JSON Web Token)**
- **Spring Mail**
- **Maven**

## Cấu trúc project

```
backend/
├── src/main/java/com/appp2p/authservice/
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   └── AuthController.java
│   ├── dto/
│   │   ├── ApiResponse.java
│   │   ├── AuthResponse.java
│   │   ├── ForgotPasswordRequest.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── ResetPasswordRequest.java
│   ├── exception/
│   │   └── GlobalExceptionHandler.java
│   ├── model/
│   │   ├── PasswordResetToken.java
│   │   └── User.java
│   ├── repository/
│   │   ├── PasswordResetTokenRepository.java
│   │   └── UserRepository.java
│   ├── security/
│   │   └── JwtAuthenticationFilter.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── EmailService.java
│   │   └── UserDetailsServiceImpl.java
│   ├── util/
│   │   └── JwtUtil.java
│   └── AuthServiceApplication.java
├── src/main/resources/
│   └── application.properties
├── pom.xml
└── README.md
```

## Cài đặt và chạy

### Yêu cầu

- Java 17+
- Maven 3.6+
- MongoDB 4.4+

### Bước 1: Cài đặt MongoDB

1. Tải và cài đặt MongoDB từ [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Khởi động MongoDB service
3. Tạo database `appp2p_auth`

### Bước 2: Cấu hình

1. Mở file `src/main/resources/application.properties`
2. Cập nhật cấu hình MongoDB nếu cần:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/appp2p_auth
   ```
3. Cấu hình email (để gửi email reset password):
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

### Bước 3: Chạy ứng dụng

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## API Endpoints

### Base URL: `http://localhost:8080/api`

### 1. Đăng ký
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "Nguyen",
  "lastName": "Van A"
}
```

### 2. Đăng nhập
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. Quên mật khẩu
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 4. Đặt lại mật khẩu
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-here",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### 5. Xác thực token reset
```http
GET /auth/validate-reset-token?token=reset-token-here
```

### 6. Health check
```http
GET /auth/health
```

## Response Format

Tất cả API đều trả về response theo format:

```json
{
  "success": true/false,
  "message": "Thông báo",
  "data": {}, // Dữ liệu (nếu có)
  "timestamp": "2023-12-01T10:00:00"
}
```

## Authentication

Sau khi đăng nhập thành công, client sẽ nhận được JWT token. Sử dụng token này trong header cho các API cần authentication:

```http
Authorization: Bearer <jwt-token>
```

## Lưu ý

1. **JWT Secret**: Thay đổi `app.jwt.secret` trong production
2. **Email Configuration**: Cấu hình email service để gửi email reset password
3. **CORS**: Đã cấu hình cho phép tất cả origins, điều chỉnh trong production
4. **Database**: MongoDB sẽ tự động tạo collections khi chạy lần đầu

## Tích hợp với Frontend

Để tích hợp với React Native frontend:

1. Cập nhật base URL trong frontend: `http://localhost:8080/api`
2. Sử dụng các endpoint trên để thay thế logic authentication hiện tại
3. Lưu JWT token và sử dụng cho các API calls khác

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB service đã chạy chưa
- Kiểm tra connection string trong `application.properties`

### Lỗi gửi email
- Kiểm tra cấu hình email trong `application.properties`
- Đảm bảo đã bật "Less secure app access" hoặc sử dụng App Password cho Gmail

### Lỗi CORS
- Kiểm tra cấu hình CORS trong `SecurityConfig.java`
- Đảm bảo frontend URL được cho phép