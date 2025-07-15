package com.fraudshield.dto;

import com.fraudshield.model.Message.Channel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassificationRequest {
    
    @NotBlank(message = "Message text is required")
    private String message;
    
    @NotNull(message = "Channel is required")
    private Channel channel;
} 