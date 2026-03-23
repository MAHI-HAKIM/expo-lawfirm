import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LogoutFunctionalityTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_logout_redirects_to_login(self):
        driver = self.driver

        # Step 1: Go to login and submit valid credentials
        try:
            get_started = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            get_started.click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            print("✅ Navigated to Sign In page")
        except Exception as e:
            self.fail(f"❌ Failed to open login page: {str(e)}")

        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
            driver.find_element(By.ID, "email").send_keys("mahi@gmail.com")  # Change if needed
            driver.find_element(By.ID, "password").send_keys("123456")    # Change if needed
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Logged in with valid user")
        except Exception as e:
            self.fail(f"❌ Failed to login: {str(e)}")

        # Step 2: Wait for sidebar logout button
        try:
            logout_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//span[text()='Logout']"))
            )
            print("✅ Logout button found")
        except Exception as e:
            self.fail(f"❌ Logout button not found: {str(e)}")

        # Step 3: Click Logout
        try:
            logout_button.click()
            print("✅ Clicked logout")
        except Exception as e:
            self.fail(f"❌ Could not click logout: {str(e)}")

        # Step 4: Verify redirect to login or landing page
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            print("✅ Successfully redirected to home/login after logout")
        except Exception as e:
            self.fail(f"❌ Logout failed or no redirection: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
