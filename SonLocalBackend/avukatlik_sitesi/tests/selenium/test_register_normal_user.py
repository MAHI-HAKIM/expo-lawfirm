import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

class MobileSignupFlowTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Set up Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-software-rasterizer')
        
        # Enable logging
        chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
        
        # Initialize the driver with options
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.set_window_size(1440, 900)
        cls.wait = WebDriverWait(cls.driver, 10)
        
        # Navigate to the application
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def get_network_errors(self):
        try:
            logs = self.driver.get_log('browser')
            errors = []
            for log in logs:
                if log['level'] == 'SEVERE':
                    errors.append(log['message'])
            return errors
        except:
            return ["Could not retrieve browser logs"]

    def test_successful_registration(self):
        driver = self.driver
        wait = self.wait

        print("\n=== Starting Registration Test ===")
        print(f"Initial URL: {driver.current_url}")

        # Step 1: Click "Get Started" to go to login page
        try:
            get_started = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[text()='Get Started']"))
            )
            print("Found Get Started button")
            get_started.click()
            wait.until(EC.presence_of_element_located((By.ID, "email")))
            print("✅ Clicked Get Started and reached Sign In page")
            print(f"Current URL after Get Started: {driver.current_url}")
        except Exception as e:
            print("Browser errors:", self.get_network_errors())
            self.fail(f"❌ Failed to click Get Started: {str(e)}")

        # Step 2: Click "Sign up" to open registration form
        try:
            # Try different possible selectors for the sign-up link
            signup_selectors = [
                "//*[contains(text(), 'Sign up')]",
                "//a[contains(@href, '/signup')]",
                "//button[contains(text(), 'Sign up')]"
            ]
            
            signup_link = None
            for selector in signup_selectors:
                try:
                    signup_link = wait.until(
                        EC.element_to_be_clickable((By.XPATH, selector))
                    )
                    print(f"Found Sign up link with selector: {selector}")
                    break
                except:
                    continue
            
            if not signup_link:
                raise Exception("Could not find Sign up link with any selector")
            
            driver.execute_script("arguments[0].scrollIntoView(true);", signup_link)
            time.sleep(1)
            signup_link.click()
            wait.until(EC.presence_of_element_located((By.ID, "full_name")))
            print("✅ Clicked Sign up and opened registration form")
            print(f"Current URL after clicking Sign up: {driver.current_url}")
        except Exception as e:
            print("Browser errors:", self.get_network_errors())
            print("Current page source:", driver.page_source)
            self.fail(f"❌ Failed to open Sign Up form: {str(e)}")

        # Step 3: Fill out registration form
        try:
            timestamp = int(time.time())
            email = f"tester{timestamp}@example.com"

            # Clear and fill fields with explicit waits
            full_name_field = wait.until(EC.presence_of_element_located((By.ID, "full_name")))
            full_name_field.clear()
            full_name_field.send_keys("Enes Tester")
            print("Filled full name")

            email_field = wait.until(EC.presence_of_element_located((By.ID, "email")))
            email_field.clear()
            email_field.send_keys(email)
            print("Filled email")

            phone_field = wait.until(EC.presence_of_element_located((By.ID, "phone")))
            phone_field.clear()
            phone_field.send_keys("05399233294")
            print("Filled phone")

            password_field = wait.until(EC.presence_of_element_located((By.ID, "password")))
            password_field.clear()
            password_field.send_keys("TestPass123!")
            print("Filled password")

            print(f"✅ Filled form with email: {email}")
        except Exception as e:
            print("Browser errors:", self.get_network_errors())
            print(f"Current page source: {driver.page_source}")
            self.fail(f"❌ Failed to fill registration form: {str(e)}")

        # Step 4: Submit the registration form
        try:
            register_button = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Account')]"))
            )
            print("\nFound Create Account button")
            
            # Print form state before submission
            print("\nForm state before submission:")
            for field_id in ["full_name", "email", "phone", "password"]:
                try:
                    field = driver.find_element(By.ID, field_id)
                    print(f"{field_id} field value: {field.get_attribute('value')}")
                except:
                    print(f"Could not find {field_id} field")
            
            register_button.click()
            print("Clicked Create Account button")
            
            # Check for any network errors immediately after submission
            print("\nChecking for network errors after submission...")
            network_errors = self.get_network_errors()
            if network_errors:
                print("Network errors found:", network_errors)
            
            # Wait for success toast message
            try:
                # Wait for toast message with "Registration successful!"
                success_toast = wait.until(
                    EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Registration successful!')]"))
                )
                print("✅ Successfully registered! Found success toast message")
                return  # Test passed successfully
            except TimeoutException:
                # Check for any visible error messages
                try:
                    # Try multiple error message selectors
                    error_selectors = [
                        ".error-message",
                        "[role='alert']",
                        ".text-red-500",
                        ".error",
                        ".alert-error",
                        "//div[contains(@class, 'text-red')]",  # XPath for red text
                        "//p[contains(@class, 'text-red')]"     # XPath for red paragraphs
                    ]
                    
                    for selector in error_selectors:
                        try:
                            if selector.startswith("//"):
                                error_element = driver.find_element(By.XPATH, selector)
                            else:
                                error_element = driver.find_element(By.CSS_SELECTOR, selector)
                            
                            if error_element.is_displayed():
                                print(f"Found error message with selector {selector}: {error_element.text}")
                                self.fail(f"❌ Registration failed with error: {error_element.text}")
                        except NoSuchElementException:
                            continue
                    
                    print("\nNo visible error message found, checking page state:")
                    print(f"Current URL: {driver.current_url}")
                    print("Network errors:", self.get_network_errors())
                    print("\nForm state after submission:")
                    for field_id in ["full_name", "email", "phone", "password"]:
                        try:
                            field = driver.find_element(By.ID, field_id)
                            print(f"{field_id} field value: {field.get_attribute('value')}")
                        except:
                            print(f"Could not find {field_id} field")
                    
                    # Print the entire page source for debugging
                    print("\nPage source after submission:")
                    print(driver.page_source)
                    
                    self.fail("❌ Registration failed - no success message found")
                except Exception as e:
                    print(f"Error while checking for messages: {str(e)}")
                    raise
                
        except Exception as e:
            print("Final browser errors:", self.get_network_errors())
            self.fail(f"❌ Failed to submit registration form: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
