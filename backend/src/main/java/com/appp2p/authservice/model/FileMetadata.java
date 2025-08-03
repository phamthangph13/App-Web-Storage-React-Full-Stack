package com.appp2p.authservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "file_metadata")
public class FileMetadata {
    
    @Id
    private String id;
    
    private String fileName;
    private String originalFileName;
    private String contentType;
    private long fileSize;
    private String gridFsId;
    private String uploadedBy; // User email
    private LocalDateTime uploadedAt;
    private String fileType; // IMAGE, VIDEO, DOCUMENT
    
    // Constructors
    public FileMetadata() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    public FileMetadata(String fileName, String originalFileName, String contentType, 
                       long fileSize, String gridFsId, String uploadedBy, String fileType) {
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.gridFsId = gridFsId;
        this.uploadedBy = uploadedBy;
        this.fileType = fileType;
        this.uploadedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getOriginalFileName() {
        return originalFileName;
    }
    
    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
    
    public String getGridFsId() {
        return gridFsId;
    }
    
    public void setGridFsId(String gridFsId) {
        this.gridFsId = gridFsId;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
}