package com.appp2p.authservice.service;

import com.appp2p.authservice.dto.*;
import com.appp2p.authservice.model.PasswordResetToken;
import com.appp2p.authservice.model.User;
import com.appp2p.authservice.repository.PasswordResetTokenRepository;
import com.appp2p.authservice.repository.UserRepository;
import com.appp2p.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private EmailService emailService;
    
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            // Get user details
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user);
            
            // Calculate expiration time
            LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(jwtUtil.getExpirationTime() / 1000);
            
            AuthResponse authResponse = new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                expiresAt
            );
            
            return ApiResponse.success("Đăng nhập thành công", authResponse);
            
        } catch (AuthenticationException e) {
            return ApiResponse.error("Email hoặc mật khẩu không chính xác");
        } catch (Exception e) {
            return ApiResponse.error("Đã xảy ra lỗi trong quá trình đăng nhập");
        }
    }
    
    public ApiResponse<String> register(RegisterRequest request) {
        try {
            // Validate passwords match
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Mật khẩu xác nhận không khớp");
            }
            
            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ApiResponse.error("Email đã được sử dụng");
            }
            
            // Create new user
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            
            userRepository.save(user);
            
            // Send welcome email
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
            } catch (Exception e) {
                // Log but don't fail registration
                System.err.println("Không thể gửi email chào mừng: " + e.getMessage());
            }
            
            return ApiResponse.success("Đăng ký tài khoản thành công");
            
        } catch (Exception e) {
            return ApiResponse.error("Đã xảy ra lỗi trong quá trình đăng ký");
        }
    }
    
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        try {
            // Check if user exists
            User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
            
            if (user == null) {
                // Don't reveal if email exists or not for security
                return ApiResponse.success("Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu");
            }
            
            // Delete any existing reset tokens for this email
            passwordResetTokenRepository.deleteByEmail(request.getEmail());
            
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            
            // Save reset token
            PasswordResetToken passwordResetToken = new PasswordResetToken(resetToken, request.getEmail());
            passwordResetTokenRepository.save(passwordResetToken);
            
            // Send reset email
            emailService.sendPasswordResetEmail(request.getEmail(), resetToken);
            
            return ApiResponse.success("Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn");
            
        } catch (Exception e) {
            return ApiResponse.error("Đã xảy ra lỗi trong quá trình gửi email");
        }
    }
    
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        try {
            // Validate passwords match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ApiResponse.error("Mật khẩu xác nhận không khớp");
            }
            
            // Find reset token
            PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElse(null);
            
            if (resetToken == null) {
                return ApiResponse.error("Token không hợp lệ");
            }
            
            if (resetToken.isUsed()) {
                return ApiResponse.error("Token đã được sử dụng");
            }
            
            if (resetToken.isExpired()) {
                return ApiResponse.error("Token đã hết hạn");
            }
            
            // Find user
            User user = userRepository.findByEmail(resetToken.getEmail())
                .orElse(null);
            
            if (user == null) {
                return ApiResponse.error("Không tìm thấy người dùng");
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            // Mark token as used
            resetToken.setUsed(true);
            passwordResetTokenRepository.save(resetToken);
            
            return ApiResponse.success("Đặt lại mật khẩu thành công");
            
        } catch (Exception e) {
            return ApiResponse.error("Đã xảy ra lỗi trong quá trình đặt lại mật khẩu");
        }
    }
    
    public ApiResponse<String> validateResetToken(String token) {
        try {
            PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElse(null);
            
            if (resetToken == null) {
                return ApiResponse.error("Token không hợp lệ");
            }
            
            if (resetToken.isUsed()) {
                return ApiResponse.error("Token đã được sử dụng");
            }
            
            if (resetToken.isExpired()) {
                return ApiResponse.error("Token đã hết hạn");
            }
            
            return ApiResponse.success("Token hợp lệ");
            
        } catch (Exception e) {
            return ApiResponse.error("Đã xảy ra lỗi trong quá trình xác thực token");
        }
    }
}