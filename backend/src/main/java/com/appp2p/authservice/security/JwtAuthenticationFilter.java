package com.appp2p.authservice.security;

import com.appp2p.authservice.service.UserDetailsServiceImpl;
import com.appp2p.authservice.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        final String tokenParam = request.getParameter("token");
        
        String username = null;
        String jwt = null;
        
        // Kiểm tra và extract JWT token từ Authorization header
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
        }
        // Nếu không có token trong header, kiểm tra query parameter (cho file endpoints)
        else if (tokenParam != null && !tokenParam.isEmpty()) {
            jwt = tokenParam;
        }
        
        // Xử lý JWT token nếu có
        if (jwt != null) {
            // Kiểm tra JWT token có đúng format không
            if (!jwtUtil.isValidJwtFormat(jwt)) {
                logger.error("Invalid JWT Token format: JWT strings must contain exactly 2 period characters. Token: " + jwt);
                filterChain.doFilter(request, response);
                return;
            }
            
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("Cannot extract username from JWT Token: " + e.getMessage(), e);
                filterChain.doFilter(request, response);
                return;
            }
        }
        
        // Xác thực user nếu có username và chưa được authenticate
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            } catch (Exception e) {
                logger.error("Error during authentication: " + e.getMessage(), e);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}