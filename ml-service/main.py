from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FraudShield ML Service", version="1.0.0")

# Global variables for model and tokenizer
model = None
tokenizer = None

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    probabilities: Dict[str, float]
    label: str
    risk_score: float

def load_model():
    """Load the BERT model and tokenizer"""
    global model, tokenizer
    
    try:
        logger.info("Loading BERT model...")
        # Using bert-base-uncased as a starting point
        # In production, you would load your fine-tuned model
        model_name = "bert-base-uncased"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # For demo purposes, we'll use a simple classification head
        # In production, you'd load your fine-tuned model
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name, 
            num_labels=3  # LOW, MEDIUM, HIGH
        )
        
        # Set to evaluation mode
        model.eval()
        logger.info("Model loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

def predict_fraud(text: str) -> Dict[str, Any]:
    """Predict fraud risk for given text"""
    global model, tokenizer
    
    if model is None or tokenizer is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Tokenize input
        inputs = tokenizer(
            text, 
            return_tensors="pt", 
            truncation=True, 
            max_length=512,
            padding=True
        )
        
        # Get predictions
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)
        
        # Convert to numpy for easier handling
        probs = probabilities.numpy()[0]
        
        # Define labels
        labels = ["LOW", "MEDIUM", "HIGH"]
        
        # Create probabilities dict
        prob_dict = {label: float(prob) for label, prob in zip(labels, probs)}
        
        # Get predicted label
        predicted_idx = np.argmax(probs)
        predicted_label = labels[predicted_idx]
        
        # Calculate risk score (probability of HIGH risk)
        risk_score = float(probs[2])  # HIGH risk probability
        
        return {
            "probabilities": prob_dict,
            "label": predicted_label,
            "risk_score": risk_score
        }
        
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Predict fraud risk for text"""
    logger.info(f"Received prediction request for text: {request.text[:50]}...")
    
    try:
        result = predict_fraud(request.text)
        logger.info(f"Prediction completed: {result['label']} (score: {result['risk_score']:.3f})")
        return PredictionResponse(**result)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 