import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginFlowTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")  # Update if needed
        time.sleep(2)

    def test_failed_login_with_unregistered_email(self):
        driver = self.driver

        # Step 1: Click "Sign In" button
        try:
            sign_in_link = driver.find_element(By.XPATH, "//a[text()='Get Started']")
            sign_in_link.click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            print("✅ Clicked Sign In and navigated to login page")
        except Exception as e:
            self.fail(f"❌ Failed to click Sign In or wait for login page: {str(e)}")

        # Step 2: Fill in login form with **unregistered** email
        try:
            time.sleep(5)
            driver.find_element(By.ID, "email").send_keys("not.registered@example.com")
            driver.find_element(By.ID, "password").send_keys("wrongpassword123")
            print("✅ Filled unregistered email and password")
        except Exception as e:
            self.fail(f"❌ Failed to fill login form: {str(e)}")

        # Step 3: Submit form
        try:
            submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
            submit_button.click()
            time.sleep(2)
            print("✅ Submitted login form")
        except Exception as e:
            self.fail(f"❌ Failed to submit login form: {str(e)}")

        # Step 4: Verify login **failed**
        try:
            self.assertIn("/signin", driver.current_url)
            print("✅ Stayed on Sign In page after failed login (expected)")
        except AssertionError:
            self.fail("❌ Login did not fail as expected — user may have been redirected")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
