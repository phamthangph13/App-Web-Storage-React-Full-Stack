package com.appp2p.authservice.controller;

import com.appp2p.authservice.dto.ApiResponse;
import com.appp2p.authservice.dto.FileUploadResponse;
import com.appp2p.authservice.model.FileMetadata;
import com.appp2p.authservice.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
@Tag(name = "File Management", description = "API endpoints for file upload, download, and management")
@SecurityRequirement(name = "Bearer Authentication")
public class FileController {
    
    @Autowired
    private FileService fileService;
    
    @Operation(summary = "Upload file", description = "Upload a file to the server")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File uploaded successfully",
                content = @Content(schema = @Schema(implementation = FileUploadResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file or file too large",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileUploadResponse>> uploadFile(
            @Parameter(description = "File to upload", required = true)
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FileUploadResponse response = fileService.uploadFile(file, userEmail);
            return ResponseEntity.ok(
                ApiResponse.success("File đã được tải lên thành công", response)
            );
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi tải file: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @Operation(summary = "Get user files", description = "Get all files uploaded by the authenticated user")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Files retrieved successfully",
                content = @Content(schema = @Schema(implementation = FileUploadResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-files")
    public ResponseEntity<ApiResponse<List<FileUploadResponse>>> getMyFiles(
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<FileUploadResponse> files = fileService.getUserFiles(userEmail);
            return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách file thành công", files)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi lấy danh sách file: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Get user files by type", description = "Get files uploaded by the authenticated user filtered by file type")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Files retrieved successfully",
                content = @Content(schema = @Schema(implementation = FileUploadResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-files/{fileType}")
    public ResponseEntity<ApiResponse<List<FileUploadResponse>>> getMyFilesByType(
            @Parameter(description = "File type (IMAGE, VIDEO, DOCUMENT)", required = true)
            @PathVariable String fileType,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<FileUploadResponse> files = fileService.getUserFilesByType(userEmail, fileType.toUpperCase());
            return ResponseEntity.ok(
                ApiResponse.success("Lấy danh sách file theo loại thành công", files)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi lấy danh sách file: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Download file", description = "Download a file by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File downloaded successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not file owner"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/download/{fileId}")
    public ResponseEntity<InputStreamResource> downloadFile(
            @Parameter(description = "File ID", required = true)
            @PathVariable String fileId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FileMetadata metadata = fileService.getFileMetadata(fileId);
            
            // Check if user owns the file
            if (!metadata.getUploadedBy().equals(userEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            InputStream fileStream = fileService.downloadFile(fileId);
            InputStreamResource resource = new InputStreamResource(fileStream);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + metadata.getOriginalFileName() + "\"")
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .contentLength(metadata.getFileSize())
                .body(resource);
                
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Preview file", description = "Preview a file by its ID (for images and videos)")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File preview loaded successfully"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not file owner"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/preview/{fileId}")
    public ResponseEntity<InputStreamResource> previewFile(
            @Parameter(description = "File ID", required = true)
            @PathVariable String fileId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FileMetadata metadata = fileService.getFileMetadata(fileId);
            
            // Check if user owns the file
            if (!metadata.getUploadedBy().equals(userEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            InputStream fileStream = fileService.downloadFile(fileId);
            InputStreamResource resource = new InputStreamResource(fileStream);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getContentType()))
                .contentLength(metadata.getFileSize())
                .body(resource);
                
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @Operation(summary = "Delete file", description = "Delete a file by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File deleted successfully",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file ID or access denied",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> deleteFile(
            @Parameter(description = "File ID", required = true)
            @PathVariable String fileId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            fileService.deleteFile(fileId, userEmail);
            return ResponseEntity.ok(
                ApiResponse.success("File đã được xóa thành công")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi xóa file: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Get file info", description = "Get detailed information about a file by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File information retrieved successfully",
                content = @Content(schema = @Schema(implementation = FileMetadata.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not file owner"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/info/{fileId}")
    public ResponseEntity<ApiResponse<FileMetadata>> getFileInfo(
            @Parameter(description = "File ID", required = true)
            @PathVariable String fileId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FileMetadata metadata = fileService.getFileMetadata(fileId);
            
            // Check if user owns the file
            if (!metadata.getUploadedBy().equals(userEmail)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Bạn không có quyền xem thông tin file này"));
            }
            
            return ResponseEntity.ok(
                ApiResponse.success("Lấy thông tin file thành công", metadata)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi lấy thông tin file: " + e.getMessage()));
        }
    }
    
    @Operation(summary = "Rename file", description = "Rename a file by its ID")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "File renamed successfully",
                content = @Content(schema = @Schema(implementation = FileUploadResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid file ID or new name",
                content = @Content(schema = @Schema(implementation = String.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Access denied - not file owner"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "File not found"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{fileId}/rename")
    public ResponseEntity<ApiResponse<FileUploadResponse>> renameFile(
            @Parameter(description = "File ID", required = true)
            @PathVariable String fileId,
            @Parameter(description = "New file name", required = true)
            @RequestParam String newFileName,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            FileUploadResponse response = fileService.renameFile(fileId, newFileName, userEmail);
            return ResponseEntity.ok(
                ApiResponse.success("File đã được đổi tên thành công", response)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Lỗi khi đổi tên file: " + e.getMessage()));
        }
    }
}