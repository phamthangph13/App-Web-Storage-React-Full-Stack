package com.appp2p.authservice.dto;

import java.time.LocalDateTime;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private String email;
    private String firstName;
    private String lastName;
    private LocalDateTime expiresAt;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String email, String firstName, String lastName, LocalDateTime expiresAt) {
        this.token = token;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.expiresAt = expiresAt;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}