package com.fraudshield.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false)
    private Channel channel;
    
    @Column(name = "text", columnDefinition = "TEXT", nullable = false)
    private String text;
    
    @Column(name = "risk_score", nullable = false)
    private Double riskScore;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "label", nullable = false)
    private RiskLabel label;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum Channel {
        EMAIL, SMS, CALL
    }
    
    public enum RiskLabel {
        LOW, MEDIUM, HIGH
    }
} 