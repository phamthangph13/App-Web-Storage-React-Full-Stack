package com.appp2p.authservice.repository;

import com.appp2p.authservice.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    Optional<PasswordResetToken> findByEmail(String email);
    
    void deleteByEmail(String email);
    
    void deleteByToken(String token);
}