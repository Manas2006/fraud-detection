package com.fraudshield.controller;

import com.fraudshield.model.Message;
import com.fraudshield.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.security.Principal;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {
    
    private final MessageRepository messageRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<Page<Message>> getMessages(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Principal principal) {
        
        // TODO: Add authorization check to ensure user can only access their own messages
        log.info("Retrieving messages for user: {} since: {}", userId, since);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByUserIdWithRiskPriority(userId, since, pageable);
        
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/stats/{userId}")
    public ResponseEntity<MessageStats> getMessageStats(
            @PathVariable String userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        
        LocalDateTime sinceDate = since != null ? since : LocalDateTime.now().minusDays(7);
        long totalMessages = messageRepository.countByUserIdSince(userId, sinceDate);
        
        MessageStats stats = MessageStats.builder()
                .userId(userId)
                .totalMessages(totalMessages)
                .since(sinceDate)
                .build();
        
        return ResponseEntity.ok(stats);
    }
    
    public static class MessageStats {
        private String userId;
        private long totalMessages;
        private LocalDateTime since;
        
        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public long getTotalMessages() { return totalMessages; }
        public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }
        public LocalDateTime getSince() { return since; }
        public void setSince(LocalDateTime since) { this.since = since; }
        
        public static MessageStatsBuilder builder() {
            return new MessageStatsBuilder();
        }
        
        public static class MessageStatsBuilder {
            private MessageStats stats = new MessageStats();
            
            public MessageStatsBuilder userId(String userId) {
                stats.userId = userId;
                return this;
            }
            
            public MessageStatsBuilder totalMessages(long totalMessages) {
                stats.totalMessages = totalMessages;
                return this;
            }
            
            public MessageStatsBuilder since(LocalDateTime since) {
                stats.since = since;
                return this;
            }
            
            public MessageStats build() {
                return stats;
            }
        }
    }
} 