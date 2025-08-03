# AppP2P Backend - Code Documentation

## Tổng quan dự án

AppP2P Backend là một RESTful API service được xây dựng bằng **Spring Boot 3.2.0** và **Java 17**, cung cấp các chức năng xác thực và quản lý người dùng cho ứng dụng mobile AppP2P.

## Công nghệ sử dụng

- **Spring Boot 3.2.0**: Framework chính
- **Spring Security**: Bảo mật và xác thực
- **Spring Data MongoDB**: Database NoSQL
- **JWT (JSON Web Token)**: Xác thực stateless
- **Spring Mail**: Gửi email
- **OpenAPI/Swagger**: API Documentation
- **Maven**: Dependency management

## Cấu trúc thư mục

```
backend/
├── src/main/java/com/appp2p/authservice/
│   ├── AuthServiceApplication.java          # Main application class
│   ├── config/                              # Configuration classes
│   │   ├── OpenApiConfig.java              # Swagger configuration
│   │   └── SecurityConfig.java             # Spring Security configuration
│   ├── controller/                          # REST Controllers
│   │   ├── AuthController.java             # Authentication endpoints
│   │   └── FileController.java             # File upload endpoints
│   ├── dto/                                # Data Transfer Objects
│   │   ├── ApiResponse.java                # Standard API response wrapper
│   │   ├── AuthResponse.java               # Login response
│   │   ├── FileUploadResponse.java         # File upload response
│   │   ├── ForgotPasswordRequest.java      # Forgot password request
│   │   ├── LoginRequest.java               # Login request
│   │   ├── RegisterRequest.java            # Register request
│   │   └── ResetPasswordRequest.java       # Reset password request
│   ├── exception/                          # Exception handling
│   │   └── GlobalExceptionHandler.java     # Global exception handler
│   ├── model/                              # Entity models
│   │   ├── FileMetadata.java               # File metadata entity
│   │   ├── PasswordResetToken.java         # Password reset token entity
│   │   └── User.java                       # User entity
│   ├── repository/                         # Data access layer
│   │   ├── FileMetadataRepository.java     # File metadata repository
│   │   ├── PasswordResetTokenRepository.java # Password reset token repository
│   │   └── UserRepository.java             # User repository
│   ├── security/                           # Security components
│   │   └── JwtAuthenticationFilter.java    # JWT authentication filter
│   ├── service/                            # Business logic layer
│   │   ├── AuthService.java                # Authentication service
│   │   ├── EmailService.java               # Email service
│   │   ├── FileService.java                # File service
│   │   └── UserDetailsServiceImpl.java     # User details service
│   └── util/                               # Utility classes
│       └── JwtUtil.java                    # JWT utility
└── src/main/resources/
    └── application.properties              # Application configuration
```

## Chi tiết các thành phần chính

### 1. AuthServiceApplication.java
```java
@SpringBootApplication
@EnableMongoAuditing
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
```
- **@SpringBootApplication**: Tự động cấu hình Spring Boot
- **@EnableMongoAuditing**: Bật tính năng audit cho MongoDB (createdAt, updatedAt)

### 2. Configuration Classes

#### SecurityConfig.java
- Cấu hình Spring Security
- Định nghĩa các endpoint được phép truy cập mà không cần xác thực
- Cấu hình CORS cho cross-origin requests
- Cấu hình password encoder (BCrypt)

#### OpenApiConfig.java
- Cấu hình Swagger UI cho API documentation
- Định nghĩa thông tin API và contact

### 3. Controllers

#### AuthController.java
Cung cấp các REST endpoints cho xác thực:

- **POST /auth/login**: Đăng nhập người dùng
- **POST /auth/register**: Đăng ký tài khoản mới
- **POST /auth/forgot-password**: Gửi email đặt lại mật khẩu
- **POST /auth/reset-password**: Đặt lại mật khẩu với token
- **GET /auth/validate-reset-token**: Xác thực token đặt lại mật khẩu
- **GET /auth/health**: Kiểm tra trạng thái service

#### FileController.java
Cung cấp các endpoints cho upload file:
- **POST /files/upload**: Upload file
- **GET /files/{id}**: Lấy thông tin file
- **GET /files**: Lấy danh sách file của user

### 4. DTOs (Data Transfer Objects)

#### ApiResponse.java
```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
}
```
Wrapper chuẩn cho tất cả API responses.

#### AuthResponse.java
```java
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime expiresAt;
}
```
Response cho login thành công.

### 5. Models (Entities)

#### User.java
```java
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### PasswordResetToken.java
```java
@Document(collection = "password_reset_tokens")
public class PasswordResetToken {
    @Id
    private String id;
    private String token;
    private String email;
    private boolean used;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
```

### 6. Services

#### AuthService.java
Chứa business logic cho xác thực:

**Login Method:**
```java
public ApiResponse<AuthResponse> login(LoginRequest request) {
    // 1. Authenticate với Spring Security
    // 2. Generate JWT token
    // 3. Return AuthResponse với token
}
```

**Register Method:**
```java
public ApiResponse<String> register(RegisterRequest request) {
    // 1. Validate password confirmation
    // 2. Check email exists
    // 3. Encode password với BCrypt
    // 4. Save user to database
    // 5. Send welcome email
}
```

**Forgot Password Method:**
```java
public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
    // 1. Generate reset token
    // 2. Save token to database
    // 3. Send reset email
}
```

#### EmailService.java
Xử lý gửi email:
- **sendWelcomeEmail()**: Email chào mừng khi đăng ký
- **sendPasswordResetEmail()**: Email đặt lại mật khẩu

#### FileService.java
Xử lý upload và quản lý file:
- **uploadFile()**: Upload file lên server
- **getFileMetadata()**: Lấy thông tin file
- **getUserFiles()**: Lấy danh sách file của user

### 7. Security

#### JwtAuthenticationFilter.java
```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) {
        // 1. Extract JWT token từ Authorization header
        // 2. Validate token
        // 3. Set authentication context
    }
}
```

#### JwtUtil.java
```java
@Component
public class JwtUtil {
    public String generateToken(User user) {
        // Generate JWT token với user claims
    }
    
    public String getEmailFromToken(String token) {
        // Extract email từ JWT token
    }
    
    public boolean validateToken(String token) {
        // Validate JWT token
    }
}
```

### 8. Repositories

#### UserRepository.java
```java
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

#### PasswordResetTokenRepository.java
```java
@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByEmail(String email);
}
```

## Cấu hình ứng dụng

### application.properties
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/appp2p_auth

# JWT Configuration
app.jwt.secret=mySecretKey123456789012345678901234567890
app.jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/forgot-password` | Quên mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu |
| GET | `/auth/validate-reset-token` | Xác thực token |
| GET | `/auth/health` | Health check |

### File Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/files/upload` | Upload file |
| GET | `/files/{id}` | Lấy thông tin file |
| GET | `/files` | Lấy danh sách file |

## Bảo mật

1. **JWT Authentication**: Sử dụng JWT token cho xác thực stateless
2. **Password Encryption**: BCrypt để mã hóa mật khẩu
3. **CORS Configuration**: Cho phép cross-origin requests
4. **Input Validation**: Validation cho tất cả input
5. **Exception Handling**: Global exception handler

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "bcrypt_hashed_password",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Password Reset Tokens Collection
```json
{
  "_id": "ObjectId",
  "token": "uuid_string",
  "email": "user@example.com",
  "used": false,
  "expiresAt": "2024-01-01T01:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### File Metadata Collection
```json
{
  "_id": "ObjectId",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "userId": "user_id",
  "uploadDate": "2024-01-01T00:00:00Z"
}
```

## Deployment

### Docker
```bash
# Build image
docker build -t appp2p-backend .

# Run container
docker run -p 8080:8080 appp2p-backend
```

### Local Development
```bash
# Run với Maven
mvn spring-boot:run

# Hoặc build và run
mvn clean package
java -jar target/auth-service-0.0.1-SNAPSHOT.jar
```

## Testing

### Unit Tests
- Sử dụng JUnit 5 và Mockito
- Test coverage cho services và controllers
- Test cases trong `src/test/java/`

### API Testing
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- Postman collection có sẵn

## Monitoring & Logging

- **Logging**: Sử dụng SLF4J với Logback
- **Health Check**: `/auth/health` endpoint
- **Metrics**: Spring Boot Actuator (có thể thêm)

## Troubleshooting

### Common Issues
1. **MongoDB Connection**: Đảm bảo MongoDB đang chạy
2. **Email Configuration**: Kiểm tra SMTP settings
3. **JWT Secret**: Đảm bảo secret key đủ mạnh
4. **CORS**: Kiểm tra CORS configuration cho frontend

### Debug Mode
```properties
logging.level.com.appp2p=DEBUG
logging.level.org.springframework.security=DEBUG
``` 