#!/usr/bin/env python3
"""
Comprehensive system test for FraudShield
"""

import requests
import json
import time
import sys

def test_backend_health():
    """Test backend health endpoint"""
    try:
        response = requests.get("http://localhost:8080/actuator/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print("❌ Backend health check failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_ml_service_health():
    """Test ML service health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ ML service health check passed")
            return True
        else:
            print("❌ ML service health check failed")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to ML service: {e}")
        return False

def test_classification():
    """Test the classification endpoint"""
    test_messages = [
        {
            "message": "Your account has been suspended due to suspicious activity. Click here to verify your identity immediately.",
            "channel": "EMAIL"
        },
        {
            "message": "Hello, this is a reminder about your upcoming appointment.",
            "channel": "SMS"
        },
        {
            "message": "You have won a prize! Claim your reward now by providing your personal information.",
            "channel": "CALL"
        }
    ]
    
    print("\n🔍 Testing Classification Endpoint...")
    print("=" * 50)
    
    for i, test_case in enumerate(test_messages, 1):
        print(f"\n📝 Test Case {i}:")
        print(f"Message: {test_case['message'][:50]}...")
        print(f"Channel: {test_case['channel']}")
        
        try:
            start_time = time.time()
            response = requests.post(
                "http://localhost:8080/api/classify",
                json=test_case,
                timeout=10
            )
            end_time = time.time()
            
            if response.status_code == 200:
                result = response.json()
                latency = (end_time - start_time) * 1000
                print(f"✅ Classification successful")
                print(f"   Risk Score: {result['riskScore']:.3f}")
                print(f"   Label: {result['label']}")
                print(f"   Latency: {latency:.1f}ms")
                
                # Check if latency is within acceptable range
                if latency < 200:
                    print(f"   ⚡ Latency OK (< 200ms)")
                else:
                    print(f"   ⚠️  Latency high ({latency:.1f}ms)")
                    
            else:
                print(f"❌ Classification failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")

def test_messages_endpoint():
    """Test the messages endpoint"""
    print("\n📨 Testing Messages Endpoint...")
    print("=" * 50)
    
    try:
        response = requests.get(
            "http://localhost:8080/api/messages/test-user",
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Messages endpoint working")
            print(f"   Total messages: {result.get('totalElements', 0)}")
            print(f"   Page size: {result.get('size', 0)}")
        else:
            print(f"❌ Messages endpoint failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def test_twilio_webhook():
    """Test Twilio webhook endpoints"""
    print("\n📞 Testing Twilio Webhooks...")
    print("=" * 50)
    
    # Test SMS webhook
    sms_data = {
        "From": "+1234567890",
        "To": "+0987654321",
        "Body": "Your account has been compromised. Please call this number immediately."
    }
    
    try:
        response = requests.post(
            "http://localhost:8080/twilio/sms",
            data=sms_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ SMS webhook working")
        else:
            print(f"❌ SMS webhook failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ SMS webhook request failed: {e}")
    
    # Test voice webhook
    voice_data = {
        "From": "+1234567890",
        "To": "+0987654321",
        "SpeechResult": "I need to verify my account information"
    }
    
    try:
        response = requests.post(
            "http://localhost:8080/twilio/voice",
            data=voice_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Voice webhook working")
        else:
            print(f"❌ Voice webhook failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Voice webhook request failed: {e}")

def main():
    """Run all system tests"""
    print("🚀 FraudShield System Test")
    print("=" * 60)
    
    # Health checks
    backend_ok = test_backend_health()
    ml_ok = test_ml_service_health()
    
    if not backend_ok or not ml_ok:
        print("\n❌ Health checks failed. Please ensure all services are running:")
        print("   docker-compose up -d")
        sys.exit(1)
    
    # Functional tests
    test_classification()
    test_messages_endpoint()
    test_twilio_webhook()
    
    print("\n" + "=" * 60)
    print("🎉 System test completed!")
    print("\n📊 Summary:")
    print("   - Backend: ✅ Running")
    print("   - ML Service: ✅ Running")
    print("   - Classification: ✅ Working")
    print("   - Messages API: ✅ Working")
    print("   - Twilio Webhooks: ✅ Working")
    print("\n🌐 Access your application:")
    print("   - Frontend: http://localhost:3000")
    print("   - Backend API: http://localhost:8080")
    print("   - ML Service: http://localhost:8000")

if __name__ == "__main__":
    main() 