import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AdminSelectUserTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_select_first_user_in_search_results(self):
        driver = self.driver

        # Step 1: Login as admin
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))

            driver.find_element(By.ID, "email").send_keys("admin@example.com")  # ✅ UPDATE
            driver.find_element(By.ID, "password").send_keys("adminpass123")    # ✅ UPDATE
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Logged in as Admin")
        except Exception as e:
            self.fail(f"❌ Login failed: {str(e)}")

        # Step 2: Go to User Management page
        try:
            WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, "Users"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'User Management')]")))
            print("✅ Arrived on User Management")
        except Exception as e:
            self.fail(f"❌ Could not navigate to Users page: {str(e)}")

        # Step 3: Perform a search
        try:
            search_input = driver.find_element(By.XPATH, "//input[@placeholder='Search by name or email...']")
            search_input.clear()
            search_input.send_keys("enes")

            driver.find_element(By.XPATH, "//button[contains(text(), 'Search')]").click()
            print("✅ Search performed")
        except Exception as e:
            self.fail(f"❌ Search failed: {str(e)}")

        # Step 4: Select the first user (or click first "Select"/"Edit"/"Action" button)
        try:
            # Adjust the button text as needed — example uses "Select"
            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Select')]"))
            ).click()
            print("✅ Clicked Select on first user result")
        except Exception as e:
            self.fail(f"❌ Failed to click on user action: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
