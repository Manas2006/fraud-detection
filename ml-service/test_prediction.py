#!/usr/bin/env python3
"""
Simple test script to verify ML service functionality
"""

import requests
import json
import time

def test_ml_service():
    """Test the ML service prediction endpoint"""
    
    # Test cases
    test_cases = [
        {
            "text": "Your account has been suspended due to suspicious activity. Click here to verify your identity immediately.",
            "expected_risk": "HIGH"
        },
        {
            "text": "Hello, this is a reminder about your upcoming appointment.",
            "expected_risk": "LOW"
        },
        {
            "text": "You have won a prize! Claim your reward now by providing your personal information.",
            "expected_risk": "HIGH"
        }
    ]
    
    base_url = "http://localhost:8000"
    
    print("🧪 Testing ML Service...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        health_response = requests.get(f"{base_url}/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            return
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to ML service: {e}")
        return
    
    # Test predictions
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test Case {i}:")
        print(f"Text: {test_case['text'][:50]}...")
        print(f"Expected Risk: {test_case['expected_risk']}")
        
        try:
            response = requests.post(
                f"{base_url}/predict",
                json={"text": test_case["text"]},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Prediction successful")
                print(f"   Risk Score: {result['risk_score']:.3f}")
                print(f"   Label: {result['label']}")
                print(f"   Probabilities: {result['probabilities']}")
            else:
                print(f"❌ Prediction failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 ML Service test completed!")

if __name__ == "__main__":
    test_ml_service() 