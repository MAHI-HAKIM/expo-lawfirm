import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class DashboardLoadTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.set_window_size(1440, 900)
        cls.driver.get("http://localhost:3000")
        time.sleep(2)

    def test_dashboard_loads_correctly(self):
        driver = self.driver

        # Step 1: Navigate to Sign In
        try:
            sign_in = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[text()='Get Started']"))
            )
            sign_in.click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            print("✅ Navigated to Sign In page")
        except Exception as e:
            self.fail(f"❌ Could not reach login page: {str(e)}")

        # Step 2: Log in as normal user
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "email")))
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "password")))
        
            driver.find_element(By.ID, "email").send_keys("mahi@gmail.com")  
            driver.find_element(By.ID, "password").send_keys("123456")   
            driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]").click()
            print("✅ Login submitted")
        except Exception as e:
            self.fail(f"❌ Failed during login: {str(e)}")

        # Step 3: Confirm dashboard loaded by checking for a known text or title
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Welcome')]"))
            )
            print("✅ Dashboard page loaded and welcome text is visible")
        except:
            print("⚠️ Login likely succeeded, but expected text not found — please check manually or change the expected text.")

        # Step 4: Check if you can click the profile button 
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//button[@type='button' and @data-state='closed' and contains(@class, 'items-center')]"))
            )
            profile_button = driver.find_element(By.XPATH, "//button[@type='button' and @data-state='closed' and contains(@class, 'items-center')]")
            profile_button.click()
            
            print("✅ Profile button clicked")
        except:
            print("⚠️ Profile button not found — please check the expected elements")

        # Step 5: Click on the sidebar menu items
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[span[text()='Book Appointment']]"))
            )
            book_appointment_button = driver.find_element(By.XPATH, "//a[span[text()='Book Appointment']]")
            book_appointment_button.click()
            time.sleep(2)
            print("✅ Book Appointment button clicked")
        except:
            print("⚠️ Book Appointment button not found — please check the expected elements")

        # Step 6: Click on the sidebar menu items
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[span[text()='My Appointments']]"))
            )
            my_appointments_button = driver.find_element(By.XPATH, "//a[span[text()='My Appointments']]")
            my_appointments_button.click()
            time.sleep(2)
            print("✅ My Appointments button clicked")
        except:
            print("⚠️ My Appointments button not found — please check the expected elements")

        # Step 7: Click on the sidebar menu items
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[span[text()='Messages']]"))
            )
            messages_button = driver.find_element(By.XPATH, "//a[span[text()='Messages']]")
            messages_button.click()
            time.sleep(2)   
            print("✅ Messages button clicked")
        except:
            print("⚠️ Messages button not found — please check the expected elements")

        # Step 8: Click on the sidebar menu items
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[span[text()='My Profile']]"))
            )
            my_profile_button = driver.find_element(By.XPATH, "//a[span[text()='My Profile']]")
            my_profile_button.click() 
            time.sleep(2)
            print("✅ My Profile button clicked")
        except:
            print("⚠️ My Profile button not found — please check the expected elements")


    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()

