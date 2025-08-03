# MỤC LỤC BÁO CÁO MÔN HỌC CÔNG NGHỆ PHẦN MỀM
## Dự án: Ứng dụng P2P (Peer-to-Peer) với hệ thống xác thực

---

## CHƯƠNG 1: TỔNG QUAN DỰ ÁN
### 1.1. Giới thiệu dự án
- 1.1.1. Mục tiêu và phạm vi dự án
- 1.1.2. Đối tượng người dùng
- 1.1.3. Tính năng chính của hệ thống

### 1.2. Kiến trúc tổng thể
- 1.2.1. Sơ đồ kiến trúc hệ thống
- 1.2.2. Các thành phần chính
- 1.2.3. Luồng dữ liệu

### 1.3. Công nghệ sử dụng
- 1.3.1. Frontend (Mobile App - React Native/Expo)
- 1.3.2. Frontend (Website - React/TypeScript)
- 1.3.3. Backend (Spring Boot)
- 1.3.4. Cơ sở dữ liệu (MongoDB)
- 1.3.5. Docker và Containerization

---

## CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ
### 2.1. Phân tích yêu cầu
- 2.1.1. Yêu cầu chức năng
  - Quản lý người dùng (Đăng ký, Đăng nhập, Quên mật khẩu)
  - Quản lý file (Upload/Download, Chia sẻ P2P)
  - Giao diện đa nền tảng (Mobile + Web)
- 2.1.2. Yêu cầu phi chức năng
  - Hiệu suất và bảo mật
  - Khả năng mở rộng
  - Trải nghiệm người dùng

### 2.2. Thiết kế hệ thống
- 2.2.1. Kiến trúc tổng thể (3-tier)
- 2.2.2. Database Design (MongoDB)
  - User Collection
  - FileMetadata Collection
  - PasswordResetToken Collection
- 2.2.3. API Design (RESTful)
- 2.2.4. Security Design (JWT Authentication)

### 2.3. Use Cases và User Stories
- 2.3.1. Actor và hệ thống
- 2.3.2. Các use case chính
- 2.3.3. User stories cho từng tính năng

---

## CHƯƠNG 3: CÀI ĐẶT VÀ TRIỂN KHAI
### 3.1. Môi trường phát triển
- 3.1.1. Công cụ và IDE
- 3.1.2. Docker Configuration
- 3.1.3. Environment Setup

### 3.2. Backend Implementation (Spring Boot)
- 3.2.1. Project Structure
- 3.2.2. Security Implementation (JWT)
- 3.2.3. API Controllers (Auth, File)
- 3.2.4. Services Layer (Auth, File, Email)
- 3.2.5. Data Access Layer (MongoDB)

### 3.3. Frontend Implementation
- 3.3.1. Mobile App (React Native/Expo)
  - Navigation và Authentication
  - File Management
  - State Management
- 3.3.2. Website (React/TypeScript)
  - Component Architecture
  - API Integration
  - UI/UX Design

### 3.4. Docker và Deployment
- 3.4.1. Containerization Strategy
- 3.4.2. Docker Compose Configuration
- 3.4.3. Production vs Development Setup
- 3.4.4. Nginx Reverse Proxy

---

## CHƯƠNG 4: KIỂM THỬ VÀ KẾT LUẬN
### 4.1. Kiểm thử hệ thống
- 4.1.1. Unit Testing
- 4.1.2. Integration Testing
- 4.1.3. API Testing
- 4.1.4. User Acceptance Testing

### 4.2. Đánh giá kết quả
- 4.2.1. So sánh với yêu cầu ban đầu
- 4.2.2. Đánh giá hiệu suất hệ thống
- 4.2.3. Phản hồi từ người dùng
- 4.2.4. Bài học kinh nghiệm

### 4.3. Hướng phát triển
- 4.3.1. Tính năng mới dự kiến
- 4.3.2. Cải tiến kỹ thuật
- 4.3.3. Mở rộng quy mô

### 4.4. Tài liệu kỹ thuật
- 4.4.1. API Documentation
- 4.4.2. User Manual
- 4.4.3. Deployment Guide

---

## PHỤ LỤC
### A. Source Code Structure
### B. Database Schema
### C. API Endpoints List
### D. Docker Configuration
### E. Test Results
### F. User Screenshots

---

## DANH MỤC HÌNH ẢNH VÀ BẢNG
### Hình ảnh:
- Hình 1.1: Kiến trúc tổng thể hệ thống
- Hình 1.2: Sơ đồ luồng dữ liệu
- Hình 2.1: Use Case Diagram
- Hình 2.2: ERD Diagram
- Hình 3.1: Docker Architecture
- Hình 3.2: API Architecture
- Hình 4.1: Mobile App Screenshots
- Hình 4.2: Website Screenshots

### Bảng:
- Bảng 1.1: So sánh công nghệ sử dụng
- Bảng 2.1: Yêu cầu chức năng
- Bảng 2.2: Database Schema
- Bảng 3.1: API Endpoints
- Bảng 3.2: Docker Services
- Bảng 4.1: Test Results
- Bảng 4.2: Performance Metrics 