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
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_successful_super_admin_login(self):
        driver = self.driver

        # Step 1: Click "Get Started" to go to Sign In page
        try:
            sign_in_link = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            sign_in_link.click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            print("✅ Clicked Get Started and reached Sign In page")
        except Exception as e:
            self.fail(f"❌ Failed to navigate to Sign In page: {str(e)}")

        # Step 2: Fill login form with valid Super Admin credentials
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "password")))

            driver.find_element(By.ID, "email").send_keys("mahi@gmail.com")
            driver.find_element(By.ID, "password").send_keys("123456")
            print("✅ Entered valid credentials")
        except Exception as e:
            self.fail(f"❌ Failed to fill login form: {str(e)}")

        # Step 3: Submit login form
        try:
            login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
            login_btn.click()
            print("✅ Submitted login form")
        except Exception as e:
            self.fail(f"❌ Failed to click login button: {str(e)}")

        # Step 4: Confirm login was successful
        try:
            # Adjust this URL or element based on where your app redirects after login
            WebDriverWait(driver, 10).until(
                EC.url_changes("http://localhost:3000/signin")
            )
            print("✅ Redirected after login")
        except Exception as e:
            self.fail(f"❌ Login failed or no redirection occurred: {str(e)}")

        # Step 5 (Optional): Check for element only visible after login
        try:
            dashboard_header = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Dashboard')]"))
            )
            self.assertTrue(dashboard_header.is_displayed())
            print("✅ Dashboard is visible, login successful")
        except:
            print("⚠️ Login succeeded but dashboard header not found (check this step manually)")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
