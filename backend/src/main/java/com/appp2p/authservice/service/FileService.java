package com.appp2p.authservice.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.appp2p.authservice.dto.FileUploadResponse;
import com.appp2p.authservice.model.FileMetadata;
import com.appp2p.authservice.repository.FileMetadataRepository;
import com.mongodb.client.gridfs.model.GridFSFile;

@Service
public class FileService {
    
    @Autowired
    private GridFsTemplate gridFsTemplate;
    
    @Autowired
    private GridFsOperations gridFsOperations;
    
    @Autowired
    private FileMetadataRepository fileMetadataRepository;
    
    public FileUploadResponse uploadFile(MultipartFile file, String userEmail) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được để trống");
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
        
        // Determine file type
        String fileType = determineFileType(file.getContentType());
        
        // Store file in GridFS
        ObjectId gridFsId = gridFsTemplate.store(
            file.getInputStream(),
            fileName,
            file.getContentType()
        );
        
        // Save metadata
        FileMetadata metadata = new FileMetadata(
            fileName,
            originalFileName,
            file.getContentType(),
            file.getSize(),
            gridFsId.toString(),
            userEmail,
            fileType
        );
        
        metadata = fileMetadataRepository.save(metadata);
        
        // Create response
        return new FileUploadResponse(
            metadata.getId(),
            metadata.getFileName(),
            metadata.getOriginalFileName(),
            metadata.getContentType(),
            metadata.getFileSize(),
            metadata.getFileType(),
            metadata.getUploadedAt(),
            "/api/files/download/" + metadata.getId()
        );
    }
    
    public List<FileUploadResponse> getUserFiles(String userEmail) {
        List<FileMetadata> files = fileMetadataRepository.findByUploadedByOrderByUploadedAtDesc(userEmail);
        return files.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<FileUploadResponse> getUserFilesByType(String userEmail, String fileType) {
        List<FileMetadata> files = fileMetadataRepository.findByFileTypeAndUploadedByOrderByUploadedAtDesc(fileType, userEmail);
        return files.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public InputStream downloadFile(String fileId) throws IOException {
        Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
        if (metadataOpt.isEmpty()) {
            throw new IllegalArgumentException("File không tồn tại");
        }
        
        FileMetadata metadata = metadataOpt.get();
        GridFSFile gridFSFile = gridFsTemplate.findOne(
            new Query(Criteria.where("_id").is(metadata.getGridFsId()))
        );
        
        if (gridFSFile == null) {
            throw new IllegalArgumentException("File không tồn tại trong GridFS");
        }
        
        return gridFsOperations.getResource(gridFSFile).getInputStream();
    }
    
    public FileMetadata getFileMetadata(String fileId) {
        return fileMetadataRepository.findById(fileId)
            .orElseThrow(() -> new IllegalArgumentException("File không tồn tại"));
    }
    
    public void deleteFile(String fileId, String userEmail) {
        Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
        if (metadataOpt.isEmpty()) {
            throw new IllegalArgumentException("File không tồn tại");
        }
        
        FileMetadata metadata = metadataOpt.get();
        
        // Check if user owns the file
        if (!metadata.getUploadedBy().equals(userEmail)) {
            throw new IllegalArgumentException("Bạn không có quyền xóa file này");
        }
        
        // Delete from GridFS
        gridFsTemplate.delete(
            new Query(Criteria.where("_id").is(metadata.getGridFsId()))
        );
        
        // Delete metadata
        fileMetadataRepository.deleteById(fileId);
    }
    
    public FileUploadResponse renameFile(String fileId, String newFileName, String userEmail) {
        Optional<FileMetadata> metadataOpt = fileMetadataRepository.findById(fileId);
        if (metadataOpt.isEmpty()) {
            throw new IllegalArgumentException("File không tồn tại");
        }
        
        FileMetadata metadata = metadataOpt.get();
        
        // Check if user owns the file
        if (!metadata.getUploadedBy().equals(userEmail)) {
            throw new IllegalArgumentException("Bạn không có quyền đổi tên file này");
        }
        
        // Validate new filename
        if (newFileName == null || newFileName.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên file mới không được để trống");
        }
        
        // Get file extension from original file
        String originalExtension = "";
        String originalName = metadata.getOriginalFileName();
        int lastDotIndex = originalName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            originalExtension = originalName.substring(lastDotIndex);
        }
        
        // Ensure new filename has the same extension
        String newFileNameWithExtension = newFileName;
        if (!newFileName.endsWith(originalExtension)) {
            newFileNameWithExtension = newFileName + originalExtension;
        }
        
        // Update metadata
        metadata.setOriginalFileName(newFileNameWithExtension);
        metadata = fileMetadataRepository.save(metadata);
        
        // Return updated response
        return convertToResponse(metadata);
    }
    
    private String determineFileType(String contentType) {
        if (contentType == null) {
            return "DOCUMENT";
        }
        
        if (contentType.startsWith("image/")) {
            return "IMAGE";
        } else if (contentType.startsWith("video/")) {
            return "VIDEO";
        } else {
            return "DOCUMENT";
        }
    }
    
    private FileUploadResponse convertToResponse(FileMetadata metadata) {
        return new FileUploadResponse(
            metadata.getId(),
            metadata.getFileName(),
            metadata.getOriginalFileName(),
            metadata.getContentType(),
            metadata.getFileSize(),
            metadata.getFileType(),
            metadata.getUploadedAt(),
            "/api/files/download/" + metadata.getId()
        );
    }
}