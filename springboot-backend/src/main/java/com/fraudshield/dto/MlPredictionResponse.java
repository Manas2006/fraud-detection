package com.fraudshield.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MlPredictionResponse {
    
    private Map<String, Double> probabilities;
    private String label;
    private Double riskScore;
} 