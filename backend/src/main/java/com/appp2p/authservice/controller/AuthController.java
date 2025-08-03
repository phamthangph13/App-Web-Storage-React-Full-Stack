package com.appp2p.authservice.controller;

import com.appp2p.authservice.dto.*;
import com.appp2p.authservice.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "API endpoints for user authentication")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "User login", description = "Authenticate user with email and password")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid credentials",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "User registration", description = "Register a new user account")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Registration successful",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or user already exists",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<String> response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Forgot password", description = "Send password reset email to user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Reset email sent successfully",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid email or user not found",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ApiResponse<String> response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Reset password", description = "Reset user password with token")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Password reset successful",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid token or password",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<String> response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Validate reset token", description = "Validate password reset token")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token is valid",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid or expired token",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<String>> validateResetToken(
            @Parameter(description = "Password reset token", required = true)
            @RequestParam String token) {
        ApiResponse<String> response = authService.validateResetToken(token);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Health check", description = "Check if authentication service is running")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Service is healthy",
                content = @Content(schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Auth service is running"));
    }
}