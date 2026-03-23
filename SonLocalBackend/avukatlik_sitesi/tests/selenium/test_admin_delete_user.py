import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AdminDeleteUserTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_delete_user_from_results(self):
        driver = self.driver

        # Step 1: Login as Admin
        try:
            WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//a[text()='Get Started']"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))

            driver.find_element(By.ID, "email").send_keys("admin@example.com")   # ✅ UPDATE
            driver.find_element(By.ID, "password").send_keys("adminpass123")     # ✅ UPDATE
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Admin logged in")
        except Exception as e:
            self.fail(f"❌ Failed to login: {str(e)}")

        # Step 2: Go to User Management
        try:
            WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, "Users"))).click()
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'User Management')]")))
            print("✅ On User Management page")
        except Exception as e:
            self.fail(f"❌ Navigation failed: {str(e)}")

        # Step 3: Search for user
        try:
            search_input = driver.find_element(By.XPATH, "//input[@placeholder='Search by name or email...']")
            search_input.clear()
            search_input.send_keys("enes")

            driver.find_element(By.XPATH, "//button[contains(text(), 'Search')]").click()
            print("✅ Performed user search")
        except Exception as e:
            self.fail(f"❌ Failed during search: {str(e)}")

        # Step 4: Click Delete on the first result
        try:
            WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Delete')]"))
            ).click()
            print("✅ Clicked Delete button")
        except Exception as e:
            self.fail(f"❌ Delete button click failed: {str(e)}")

        # Step 5: Confirm deletion (if modal appears)
        try:
            confirm_button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Confirm')]"))
            )
            confirm_button.click()
            print("✅ Confirmed deletion")
        except:
            print("⚠️ No confirmation modal — assumed immediate delete")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()

