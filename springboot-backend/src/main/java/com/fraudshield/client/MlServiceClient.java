package com.fraudshield.client;

import com.fraudshield.dto.MlPredictionRequest;
import com.fraudshield.dto.MlPredictionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ml-service", url = "${ml.service.url:http://ml-service:8000}")
public interface MlServiceClient {
    
    @PostMapping("/predict")
    MlPredictionResponse predict(@RequestBody MlPredictionRequest request);
} 