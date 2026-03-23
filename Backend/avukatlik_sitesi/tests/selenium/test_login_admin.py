import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class SuperAdminLoginTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")  # Update if needed
        time.sleep(2)

    def test_super_admin_successful_login(self):
        driver = self.driver

        # Step 1: Click "Get Started" or equivalent button to go to Sign In
        try:
            sign_in_link = driver.find_element(By.XPATH, "//a[text()='Get Started']")
            sign_in_link.click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            print("✅ Navigated to login page")
        except Exception as e:
            self.fail(f"❌ Failed to navigate to login page: {str(e)}")

        # Step 2: Fill in login form with Super Admin credentials
        try:
            driver.find_element(By.ID, "email").send_keys("mahiabdul@gmail.com")
            driver.find_element(By.ID, "password").send_keys("mahi123456")
            print("✅ Entered super admin credentials")
        except Exception as e:
            self.fail(f"❌ Failed to fill login form: {str(e)}")

        # Step 3: Submit login form
        try:
            submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
            submit_button.click()
            print("✅ Submitted login form")
        except Exception as e:
            self.fail(f"❌ Failed to submit login form: {str(e)}")

        # Step 4: Verify successful login by checking redirect and dashboard visibility
        try:
            WebDriverWait(driver, 10).until(lambda d: "/signin" not in d.current_url)
            print(f"✅ Redirected to: {driver.current_url}")
        except Exception as e:
            self.fail(f"❌ Login failed or no redirect occurred: {str(e)}")

        # Optional: Check for dashboard or welcome message (adjust selectors if needed)
        try:
            dashboard_text = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Welcome') or contains(text(), 'Dashboard')]"))
            )
            self.assertTrue(dashboard_text.is_displayed())
            print("✅ Super admin dashboard or welcome message is visible")
        except:
            print("⚠️ No dashboard/welcome text found — check if login flow needs further verification")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
