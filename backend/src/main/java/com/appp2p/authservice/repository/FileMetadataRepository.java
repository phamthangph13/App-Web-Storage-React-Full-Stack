package com.appp2p.authservice.repository;

import com.appp2p.authservice.model.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {
    
    List<FileMetadata> findByUploadedByOrderByUploadedAtDesc(String uploadedBy);
    
    List<FileMetadata> findByFileTypeAndUploadedByOrderByUploadedAtDesc(String fileType, String uploadedBy);
    
    Optional<FileMetadata> findByGridFsId(String gridFsId);
    
    void deleteByGridFsId(String gridFsId);
    
    long countByUploadedBy(String uploadedBy);
}