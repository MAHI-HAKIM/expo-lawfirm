import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class UserProfileNavigationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_navigate_to_profile(self):
        driver = self.driver

        # Step 1: Login
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            ).click()

            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            driver.find_element(By.ID, "email").send_keys("normal@example.com")  # UPDATE this
            driver.find_element(By.ID, "password").send_keys("normalpass123")    # UPDATE this
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Logged in successfully")
        except Exception as e:
            self.fail(f"❌ Login failed: {str(e)}")

        # Step 2: Open Profile
        try:
            # Update this selector based on how your UI shows the profile access
            profile_link = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Profile')]"))
            )
            profile_link.click()
            print("✅ Clicked on Profile link")
        except Exception as e:
            self.fail(f"❌ Failed to click profile link: {str(e)}")

        # Step 3: Check for profile info loaded
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Profile')]"))
            )
            print("✅ Profile page loaded successfully")
        except:
            self.fail("❌ Profile page did not load as expected")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
