from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from typing import Dict, Any
import logging
import random

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FraudShield ML Service", version="1.0.0")

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    probabilities: Dict[str, float]
    label: str
    risk_score: float

def predict_fraud_simple(text: str) -> Dict[str, Any]:
    """Simple fraud prediction based on keywords"""
    
    # Define fraud-related keywords
    fraud_keywords = [
        'suspended', 'account', 'verify', 'immediately', 'urgent', 'action required',
        'security', 'compromised', 'locked', 'unlock', 'verify identity', 'click here',
        'prize', 'won', 'claim', 'personal information', 'social security', 'credit card',
        'bank account', 'password', 'login', 'suspicious', 'fraud', 'scam'
    ]
    
    # Count fraud keywords in text
    text_lower = text.lower()
    fraud_count = sum(1 for keyword in fraud_keywords if keyword in text_lower)
    
    # Calculate risk score based on keyword density
    total_words = len(text.split())
    keyword_density = fraud_count / max(total_words, 1)
    
    # Determine risk level
    if keyword_density > 0.1 or fraud_count >= 3:
        risk_score = min(0.9, 0.3 + keyword_density * 2)
        label = "HIGH"
    elif keyword_density > 0.05 or fraud_count >= 1:
        risk_score = min(0.7, 0.2 + keyword_density * 3)
        label = "MEDIUM"
    else:
        risk_score = max(0.1, 0.1 + random.random() * 0.2)
        label = "LOW"
    
    # Create probabilities
    if label == "HIGH":
        probabilities = {"LOW": 0.05, "MEDIUM": 0.15, "HIGH": 0.8}
    elif label == "MEDIUM":
        probabilities = {"LOW": 0.2, "MEDIUM": 0.6, "HIGH": 0.2}
    else:
        probabilities = {"LOW": 0.7, "MEDIUM": 0.25, "HIGH": 0.05}
    
    return {
        "probabilities": probabilities,
        "label": label,
        "risk_score": risk_score
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Predict fraud risk for text"""
    logger.info(f"Received prediction request for text: {request.text[:50]}...")
    
    try:
        result = predict_fraud_simple(request.text)
        logger.info(f"Prediction completed: {result['label']} (score: {result['risk_score']:.3f})")
        return PredictionResponse(**result)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 