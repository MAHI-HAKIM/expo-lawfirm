import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class MobileSignupFlowTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)  # Mobile view
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_register_new_user_from_mobile_menu(self):
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

        # Step 5: Click "Sign up" link on Sign In page
        try:
            signup_link = driver.find_element(By.XPATH, "//a[text()='Sign up']")
            signup_link.click()
            
            # Wait for the FULL NAME input to appear (confirms you're on signup page)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "full_name")))
            
            print("✅ Clicked Sign up and opened registration form")
        except Exception as e:
            self.fail(f"❌ Failed to open Sign Up form: {str(e)}")

        # Step 6: Fill registration form
        try:
            timestamp = int(time.time())
            email = f"tester{timestamp}@example.com"

            driver.find_element(By.ID, "full_name").send_keys("")
            driver.find_element(By.ID, "email").clear()
            driver.find_element(By.ID, "email").send_keys(email)
            driver.find_element(By.ID, "phone").send_keys("+1 555 123 4567")
            driver.find_element(By.ID, "password").send_keys("TestPass123!")

            print(f"✅ Filled form with email: {email}")
        except Exception as e:
            self.fail(f"❌ Failed to fill registration form: {str(e)}")


        # Step 7: Submit the form
        try:
            register_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Account')]")
            register_button.click()
            time.sleep(3)
            print("✅ Submitted registration form")
        except Exception as e:
            self.fail(f"❌ Failed to submit sign up form: {str(e)}")

        # Step 8: Confirm registration success (customize based on your app)
        # try:
        #     self.assertNotIn("/signup", driver.current_url)
        #     print("✅ Registration successful and redirected")
        # except AssertionError:
        #     self.fail("❌ Registration may have failed — still on Sign Up page")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
