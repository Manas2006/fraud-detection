package com.fraudshield.dto;

import com.fraudshield.model.Message.RiskLabel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassificationResponse {
    
    private Double riskScore;
    private RiskLabel label;
} 