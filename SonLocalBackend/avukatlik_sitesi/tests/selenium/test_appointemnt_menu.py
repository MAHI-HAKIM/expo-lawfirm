import time
import unittest
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.chrome.options import Options

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AppointmentsNavigationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Configure Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
        
        try:
            cls.driver = webdriver.Chrome(options=chrome_options)
            cls.driver.set_window_size(1440, 900)
            cls.wait = WebDriverWait(cls.driver, 20)  # Increased timeout to 20 seconds
            logger.info("Browser started successfully")
        except Exception as e:
            logger.error(f"Failed to start browser: {str(e)}")
            raise

    def setUp(self):
        """Reset to home page before each test"""
        try:
            self.driver.get("http://localhost:3000")
            time.sleep(2)  # Allow initial page load
            logger.info("Navigated to homepage")
        except Exception as e:
            logger.error(f"Failed to navigate to homepage: {str(e)}")
            raise

    def test_navigate_to_appointments(self):
        driver = self.driver
        wait = self.wait

        # Step 1: Click "Get Started"
        try:
            get_started = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[text()='Get Started']"))
            )
            get_started.click()
            logger.info("Clicked Get Started button")

            # Wait for login form to be fully loaded
            wait.until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            time.sleep(1)  # Small delay to ensure form is fully loaded
            logger.info("Login form loaded")
        except Exception as e:
            logger.error(f"Failed to reach login page: {str(e)}")
            self.fail(f"Could not open login page: {str(e)}")

        # Step 2: Login as normal user
        try:
            # Wait for elements to be clickable and visible
            email_field = wait.until(
                EC.element_to_be_clickable((By.ID, "email"))
            )
            password_field = wait.until(
                EC.element_to_be_clickable((By.ID, "password"))
            )

            # Clear fields before entering text
            email_field.clear()
            email_field.send_keys("mahi@gmail.com")
            logger.info("Entered email")

            password_field.clear()
            password_field.send_keys("123456")
            logger.info("Entered password")

            # Find and click login button
            login_btn = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign In')]"))
            )
            login_btn.click()
            logger.info("Clicked login button")
        except Exception as e:
            logger.error(f"Failed during login: {str(e)}")
            self.fail(f"Login failed: {str(e)}")

        # Step 3: Wait for dashboard and navigate to appointments
        try:
            # Wait for dashboard to load
            wait.until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Welcome')]"))
            )
            logger.info("Dashboard loaded")

            # Wait for My Appointments link and click
            appointments_link = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//a[.//span[text()='My Appointments']]"))
            )
            appointments_link.click()
            logger.info("Clicked My Appointments link")

            # Allow time for navigation
            time.sleep(2)
        except Exception as e:
            logger.error(f"Failed to navigate to appointments: {str(e)}")
            self.fail(f"Navigation to appointments failed: {str(e)}")

        # Step 4: Verify Appointments page
        try:
            # Check for elements that should be present on the appointments page
            wait.until(
                EC.presence_of_element_located((By.XPATH, 
                    "//*[contains(text(), 'Appointments') or contains(text(), 'My Appointments')]"))
            )
            logger.info("Appointments page loaded successfully")
        except Exception as e:
            logger.error(f"Failed to verify appointments page: {str(e)}")
            self.fail(f"Could not verify appointments page loaded: {str(e)}")

    def tearDown(self):
        """Clean up after each test"""
        try:
            self.driver.refresh()
        except Exception as e:
            logger.error(f"Error in tearDown: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests"""
        try:
            cls.driver.quit()
            logger.info("Browser closed successfully")
        except Exception as e:
            logger.error(f"Error closing browser: {str(e)}")

if __name__ == "__main__":
    unittest.main(verbosity=2)
