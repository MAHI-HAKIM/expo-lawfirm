import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AdminSearchUserTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_admin_can_search_user(self):
        driver = self.driver

        # Step 1: Login as admin
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))

            driver.find_element(By.ID, "email").send_keys("admin@example.com")  # UPDATE
            driver.find_element(By.ID, "password").send_keys("adminpass123")    # UPDATE
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Admin logged in")
        except Exception as e:
            self.fail(f"❌ Failed to login as admin: {str(e)}")

        # Step 2: Go to User Management
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.LINK_TEXT, "Users"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'User Management')]")))
            print("✅ Navigated to User Management")
        except Exception as e:
            self.fail(f"❌ Failed to reach User Management: {str(e)}")

        # Step 3: Search for a user
        try:
            search_input = driver.find_element(By.XPATH, "//input[@placeholder='Search by name or email...']")
            search_input.clear()
            search_input.send_keys("enes")

            search_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Search')]")
            search_button.click()
            print("✅ Performed user search")
        except Exception as e:
            self.fail(f"❌ Failed to search: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
