# AppP2P Authentication API Documentation

## Base URL
```
http://localhost:8080/api
```

## Response Format

Tất cả API responses đều có format chuẩn:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | null,
  "timestamp": "2023-12-01T10:00:00"
}
```

## Authentication Endpoints

### 1. Đăng ký tài khoản

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "Nguyen",
  "lastName": "Van A"
}
```

**Validation Rules:**
- `email`: Bắt buộc, định dạng email hợp lệ
- `password`: Bắt buộc, tối thiểu 6 ký tự
- `confirmPassword`: Bắt buộc, phải khớp với password
- `firstName`: Tùy chọn
- `lastName`: Tùy chọn

**Success Response (200):**
```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email đã được sử dụng",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

### 2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Bắt buộc, định dạng email hợp lệ
- `password`: Bắt buộc, tối thiểu 6 ký tự

**Success Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "user@example.com",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "expiresAt": "2023-12-02T10:00:00"
  },
  "timestamp": "2023-12-01T10:00:00"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

### 3. Quên mật khẩu

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Validation Rules:**
- `email`: Bắt buộc, định dạng email hợp lệ

**Success Response (200):**
```json
{
  "success": true,
  "message": "Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

**Note:** API sẽ luôn trả về success response để tránh tiết lộ thông tin email có tồn tại hay không.

### 4. Xác thực token reset mật khẩu

**Endpoint:** `GET /auth/validate-reset-token?token={token}`

**Query Parameters:**
- `token`: Reset token nhận được từ email

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token hợp lệ",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Token không hợp lệ",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

### 5. Đặt lại mật khẩu

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Validation Rules:**
- `token`: Bắt buộc
- `newPassword`: Bắt buộc, tối thiểu 6 ký tự
- `confirmPassword`: Bắt buộc, phải khớp với newPassword

**Success Response (200):**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Token đã hết hạn",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

### 6. Health Check

**Endpoint:** `GET /auth/health`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Auth service is running",
  "data": null,
  "timestamp": "2023-12-01T10:00:00"
}
```

## Authentication Header

Đối với các API cần authentication (hiện tại chưa có), sử dụng JWT token trong header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Codes

| HTTP Status | Mô tả |
|-------------|-------|
| 200 | Success |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Không có quyền truy cập |
| 403 | Forbidden - Bị cấm truy cập |
| 404 | Not Found - Không tìm thấy resource |
| 500 | Internal Server Error - Lỗi server |

## Validation Error Response

Khi có lỗi validation, response sẽ có format:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "data": {
    "email": "Email không hợp lệ",
    "password": "Mật khẩu phải có ít nhất 6 ký tự"
  },
  "timestamp": "2023-12-01T10:00:00"
}
```

## Example Usage với JavaScript/React Native

### Đăng ký
```javascript
const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Đăng ký thành công:', result.message);
    } else {
      console.error('Đăng ký thất bại:', result.message);
    }
  } catch (error) {
    console.error('Lỗi network:', error);
  }
};
```

### Đăng nhập
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Lưu token để sử dụng cho các API calls khác
      const token = result.data.token;
      localStorage.setItem('authToken', token);
      console.log('Đăng nhập thành công');
    } else {
      console.error('Đăng nhập thất bại:', result.message);
    }
  } catch (error) {
    console.error('Lỗi network:', error);
  }
};
```

### Quên mật khẩu
```javascript
const forgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Lỗi network:', error);
  }
};
```