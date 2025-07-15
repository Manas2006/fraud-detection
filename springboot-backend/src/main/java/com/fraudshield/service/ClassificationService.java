package com.fraudshield.service;

import com.fraudshield.client.MlServiceClient;
import com.fraudshield.dto.ClassificationRequest;
import com.fraudshield.dto.ClassificationResponse;
import com.fraudshield.dto.MlPredictionRequest;
import com.fraudshield.dto.MlPredictionResponse;
import com.fraudshield.model.Message;
import com.fraudshield.model.Message.RiskLabel;
import com.fraudshield.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassificationService {
    
    private final MlServiceClient mlServiceClient;
    private final MessageRepository messageRepository;
    
    @Cacheable(value = "classifications", key = "#request.message.hashCode()")
    public ClassificationResponse classifyText(ClassificationRequest request) {
        try {
            log.info("Classifying text via ML service: {}", request.getMessage().substring(0, Math.min(50, request.getMessage().length())));
            
            MlPredictionRequest mlRequest = MlPredictionRequest.builder()
                    .text(request.getMessage())
                    .build();
            
            MlPredictionResponse mlResponse = mlServiceClient.predict(mlRequest);
            
            RiskLabel label = mapMlLabelToRiskLabel(mlResponse.getLabel());
            
            return ClassificationResponse.builder()
                    .riskScore(mlResponse.getRiskScore())
                    .label(label)
                    .build();
                    
        } catch (Exception e) {
            log.error("Error classifying text", e);
            // Fallback to default classification
            return ClassificationResponse.builder()
                    .riskScore(0.1)
                    .label(RiskLabel.LOW)
                    .build();
        }
    }
    
    public Message saveMessage(String userId, ClassificationRequest request, ClassificationResponse response) {
        Message message = Message.builder()
                .userId(userId)
                .channel(request.getChannel())
                .text(request.getMessage())
                .riskScore(response.getRiskScore())
                .label(response.getLabel())
                .build();
        
        return messageRepository.save(message);
    }
    
    private RiskLabel mapMlLabelToRiskLabel(String mlLabel) {
        if (mlLabel == null) return RiskLabel.LOW;
        
        return switch (mlLabel.toLowerCase()) {
            case "fraud", "spam", "high" -> RiskLabel.HIGH;
            case "suspicious", "medium" -> RiskLabel.MEDIUM;
            default -> RiskLabel.LOW;
        };
    }
} 