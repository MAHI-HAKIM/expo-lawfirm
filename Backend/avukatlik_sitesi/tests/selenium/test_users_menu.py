import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class UsersNavigationTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_navigate_to_users(self):
        driver = self.driver

        # Step 1: Click "Get Started"
        try:
            get_started = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            get_started.click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            print("✅ Reached login page")
        except Exception as e:
            self.fail(f"❌ Failed to reach Sign In page: {str(e)}")

        # Step 2: Login with valid normal user
        try:
            driver.find_element(By.ID, "email").send_keys("normal@example.com")  # Change if needed
            driver.find_element(By.ID, "password").send_keys("normalpass123")    # Change if needed
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Submitted login form")
        except Exception as e:
            self.fail(f"❌ Failed to fill or submit login form: {str(e)}")

        # Step 3: Wait for "Users" sidebar link
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//span[text()='Users']"))
            )
            print("✅ Sidebar loaded with 'Users' link")
        except Exception as e:
            self.fail(f"❌ 'Users' link not found: {str(e)}")

        # Step 4: Click "Users"
        try:
            users_link = driver.find_element(By.XPATH, "//span[text()='Users']")
            users_link.click()
            print("✅ Clicked on Users link")
        except Exception as e:
            self.fail(f"❌ Failed to click Users link: {str(e)}")

        # Step 5: Check if Users page content is shown
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Users')]"))
            )
            print("✅ Users page is visible")
        except Exception as e:
            self.fail(f"❌ Users page did not load: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
