package com.fraudshield.controller;

import com.fraudshield.dto.ClassificationRequest;
import com.fraudshield.dto.ClassificationResponse;
import com.fraudshield.model.Message;
import com.fraudshield.service.ClassificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ClassificationController {
    
    private final ClassificationService classificationService;
    
    @PostMapping("/classify")
    public ResponseEntity<ClassificationResponse> classifyText(
            @Valid @RequestBody ClassificationRequest request,
            Principal principal) {
        
        String userId = principal != null ? principal.getName() : "anonymous";
        log.info("Classification request from user: {}", userId);
        
        ClassificationResponse response = classificationService.classifyText(request);
        
        // Save the message
        Message savedMessage = classificationService.saveMessage(userId, request, response);
        log.info("Saved message with ID: {} and risk score: {}", savedMessage.getId(), response.getRiskScore());
        
        return ResponseEntity.ok(response);
    }
} 