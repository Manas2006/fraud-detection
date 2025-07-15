#!/usr/bin/env python3
"""
Test Script for Message Analysis Feature
Tests the new message analysis functionality with various scam and legitimate messages
"""

import time
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

class MessageAnalysisTester:
    def __init__(self):
        self.base_url = "http://localhost:3000"
        self.driver = None
        
    def setup_driver(self):
        """Setup Chrome WebDriver with headless mode"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            print("✅ Chrome WebDriver initialized successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to initialize WebDriver: {e}")
            return False
    
    def login(self):
        """Login to the dashboard"""
        try:
            self.driver.get(f"{self.base_url}/login")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
            
            email_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='email']")
            password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            
            email_input.send_keys("demo@fraudshield.com")
            password_input.send_keys("demo123")
            submit_button.click()
            
            WebDriverWait(self.driver, 10).until(
                EC.url_contains("/dashboard")
            )
            print("✅ Login successful")
            return True
        except Exception as e:
            print(f"❌ Login failed: {e}")
            return False
    
    def test_scam_message(self):
        """Test with a clear scam message"""
        scam_message = """
URGENT: Your bank account has been compromised!
Click here immediately to verify your account: http://fake-bank-verify.com
Limited time offer - act now or your account will be suspended.
This is your final warning from the IRS.
        """
        
        return self.analyze_message(scam_message, "scam", "high_risk")
    
    def test_legitimate_message(self):
        """Test with a legitimate message"""
        legitimate_message = """
Thank you for your recent purchase with Amazon.
Your order #12345 has been confirmed and will be shipped within 2-3 business days.
If you have any questions, please contact our customer service team.
We appreciate your business!
        """
        
        return self.analyze_message(legitimate_message, "legitimate", "low_risk")
    
    def test_suspicious_message(self):
        """Test with a suspicious but not clearly scam message"""
        suspicious_message = """
Hello, this is Microsoft Support calling about your computer.
We detected a virus on your system and need to help you remove it.
Please call us back at 1-800-FAKE-NUMBER immediately.
Your computer security is at risk.
        """
        
        return self.analyze_message(suspicious_message, "suspicious", "medium_risk")
    
    def analyze_message(self, message, expected_type, expected_risk):
        """Analyze a message and verify the results"""
        try:
            # Navigate to analysis page
            analysis_link = self.driver.find_element(By.CSS_SELECTOR, "a[href='/analysis']")
            analysis_link.click()
            
            WebDriverWait(self.driver, 10).until(
                EC.url_contains("/analysis")
            )
            
            # Find and fill the textarea
            textarea = self.driver.find_element(By.CSS_SELECTOR, "textarea")
            textarea.clear()
            textarea.send_keys(message)
            
            # Click analyze button
            analyze_button = self.driver.find_element(By.CSS_SELECTOR, "button:contains('Analyze Message')")
            analyze_button.click()
            
            # Wait for analysis to complete
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='analysis-results']"))
            )
            
            # Check for risk score
            risk_score_element = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='risk-score']")
            risk_score = int(risk_score_element.text.replace('%', ''))
            
            # Check for red flags
            red_flags = self.driver.find_elements(By.CSS_SELECTOR, "[data-testid='red-flag']")
            
            # Check for recommendations
            recommendations = self.driver.find_elements(By.CSS_SELECTOR, "[data-testid='recommendation']")
            
            # Verify results based on expected type
            if expected_type == "scam":
                if risk_score >= 70 and len(red_flags) > 0:
                    print(f"✅ {expected_type.capitalize()} message correctly identified (Risk: {risk_score}%)")
                    return True
                else:
                    print(f"❌ {expected_type.capitalize()} message not properly identified (Risk: {risk_score}%)")
                    return False
            elif expected_type == "legitimate":
                if risk_score < 30 and len(red_flags) == 0:
                    print(f"✅ {expected_type.capitalize()} message correctly identified (Risk: {risk_score}%)")
                    return True
                else:
                    print(f"❌ {expected_type.capitalize()} message not properly identified (Risk: {risk_score}%)")
                    return False
            else:  # suspicious
                if 30 <= risk_score < 70:
                    print(f"✅ {expected_type.capitalize()} message correctly identified (Risk: {risk_score}%)")
                    return True
                else:
                    print(f"❌ {expected_type.capitalize()} message not properly identified (Risk: {risk_score}%)")
                    return False
                    
        except Exception as e:
            print(f"❌ Analysis test failed: {e}")
            return False
    
    def test_copy_report(self):
        """Test the copy report functionality"""
        try:
            # Use a simple test message
            test_message = "URGENT: Click here to verify your account: http://fake.com"
            
            # Navigate to analysis page and analyze
            analysis_link = self.driver.find_element(By.CSS_SELECTOR, "a[href='/analysis']")
            analysis_link.click()
            
            textarea = self.driver.find_element(By.CSS_SELECTOR, "textarea")
            textarea.clear()
            textarea.send_keys(test_message)
            
            analyze_button = self.driver.find_element(By.CSS_SELECTOR, "button:contains('Analyze Message')")
            analyze_button.click()
            
            # Wait for results and click copy button
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "button:contains('Copy Report')"))
            )
            
            copy_button = self.driver.find_element(By.CSS_SELECTOR, "button:contains('Copy Report')")
            copy_button.click()
            
            # Check for success message
            WebDriverWait(self.driver, 5).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "button:contains('Copied!')"))
            )
            
            print("✅ Copy report functionality working")
            return True
            
        except Exception as e:
            print(f"❌ Copy report test failed: {e}")
            return False
    
    def run_all_tests(self):
        """Run all message analysis tests"""
        print("🚀 Starting Message Analysis Tests")
        print("=" * 50)
        
        if not self.setup_driver():
            return False
        
        try:
            # Login first
            if not self.login():
                return False
            
            # Run tests
            tests = [
                ("Scam Message", self.test_scam_message),
                ("Legitimate Message", self.test_legitimate_message),
                ("Suspicious Message", self.test_suspicious_message),
                ("Copy Report", self.test_copy_report),
            ]
            
            passed = 0
            total = len(tests)
            
            for test_name, test_func in tests:
                print(f"\n📋 Testing: {test_name}")
                print("-" * 30)
                
                if test_func():
                    passed += 1
                else:
                    print(f"❌ {test_name} test failed")
                
                time.sleep(2)
            
            print(f"\n🎯 Results: {passed}/{total} tests passed")
            
            if passed == total:
                print("🎉 All message analysis tests passed!")
                return True
            else:
                print("⚠️  Some tests failed")
                return False
                
        finally:
            if self.driver:
                self.driver.quit()
                print("\n🔧 WebDriver closed")

def main():
    """Main function to run message analysis tests"""
    tester = MessageAnalysisTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✨ Message analysis feature is working perfectly!")
        print("🎨 Features tested:")
        print("   • Scam message detection")
        print("   • Legitimate message identification")
        print("   • Suspicious message analysis")
        print("   • Risk scoring and categorization")
        print("   • Red flag detection")
        print("   • Copy report functionality")
        print("\n🌐 You can now use the Analysis page at: http://localhost:3000/analysis")
    else:
        print("\n💥 Message analysis tests failed!")

if __name__ == "__main__":
    main() 