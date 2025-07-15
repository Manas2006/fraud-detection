package com.fraudshield.controller;

import com.fraudshield.dto.ClassificationRequest;
import com.fraudshield.dto.ClassificationResponse;
import com.fraudshield.model.Message;
import com.fraudshield.model.Message.Channel;
import com.fraudshield.service.ClassificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/twilio")
@RequiredArgsConstructor
@Slf4j
public class TwilioWebhookController {
    
    private final ClassificationService classificationService;
    
    @PostMapping("/sms")
    public ResponseEntity<String> handleSmsWebhook(@RequestBody Map<String, String> webhookData) {
        try {
            String from = webhookData.get("From");
            String body = webhookData.get("Body");
            String to = webhookData.get("To");
            
            log.info("Received SMS webhook from: {} to: {}", from, to);
            
            if (body == null || body.trim().isEmpty()) {
                return ResponseEntity.ok("OK");
            }
            
            ClassificationRequest request = ClassificationRequest.builder()
                    .message(body)
                    .channel(Channel.SMS)
                    .build();
            
            ClassificationResponse response = classificationService.classifyText(request);
            
            // Save with the sender's phone number as userId
            Message savedMessage = classificationService.saveMessage(from, request, response);
            log.info("Saved SMS message with risk score: {}", response.getRiskScore());
            
            // TODO: Trigger notifications for high-risk messages
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            log.error("Error processing SMS webhook", e);
            return ResponseEntity.ok("OK"); // Always return OK to Twilio
        }
    }
    
    @PostMapping("/voice")
    public ResponseEntity<String> handleVoiceWebhook(@RequestBody Map<String, String> webhookData) {
        try {
            String from = webhookData.get("From");
            String speechResult = webhookData.get("SpeechResult");
            String to = webhookData.get("To");
            
            log.info("Received voice webhook from: {} to: {}", from, to);
            
            if (speechResult == null || speechResult.trim().isEmpty()) {
                return ResponseEntity.ok("OK");
            }
            
            ClassificationRequest request = ClassificationRequest.builder()
                    .message(speechResult)
                    .channel(Channel.CALL)
                    .build();
            
            ClassificationResponse response = classificationService.classifyText(request);
            
            // Save with the caller's phone number as userId
            Message savedMessage = classificationService.saveMessage(from, request, response);
            log.info("Saved voice message with risk score: {}", response.getRiskScore());
            
            // TODO: Trigger notifications for high-risk messages
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception e) {
            log.error("Error processing voice webhook", e);
            return ResponseEntity.ok("OK"); // Always return OK to Twilio
        }
    }
} 