package com.appp2p.authservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.name}")
    private String appName;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu - " + appName);
        
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        
        String emailContent = String.format(
            "Xin chào,\n\n" +
            "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản %s của mình.\n\n" +
            "Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:\n" +
            "%s\n\n" +
            "Liên kết này sẽ hết hạn sau 1 giờ.\n\n" +
            "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ %s",
            toEmail, resetUrl, appName
        );
        
        message.setText(emailContent);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
    
    public void sendWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Chào mừng đến với " + appName);
        
        String emailContent = String.format(
            "Xin chào %s,\n\n" +
            "Chào mừng bạn đến với %s!\n\n" +
            "Tài khoản của bạn đã được tạo thành công với email: %s\n\n" +
            "Bạn có thể bắt đầu sử dụng ứng dụng ngay bây giờ.\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ %s",
            firstName != null ? firstName : "bạn", appName, toEmail, appName
        );
        
        message.setText(emailContent);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't throw exception for welcome email
            System.err.println("Không thể gửi email chào mừng: " + e.getMessage());
        }
    }
}