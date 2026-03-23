import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

class FAQSectionTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
        cls.driver.maximize_window()
        cls.driver.get("http://localhost:3000")  # Update this if needed
        time.sleep(2)

    def test_faq_expand_and_collapse(self):
        driver = self.driver

        # Scroll to the FAQ section using heading
        try:
            faq_heading = driver.find_element(By.XPATH, "//p[contains(text(), 'FREQUENTLY ASKED QUESTIONS')]")
            driver.execute_script("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", faq_heading)
            time.sleep(2)
            print("✅ Scrolled to FAQ section")
        except Exception as e:
            self.fail(f"❌ Failed to scroll to FAQ section: {str(e)}")

        # Open first question
        try:
            q1 = driver.find_element(By.XPATH, "//button[span[text()='How we can help you?']]")
            q1.click()
            time.sleep(1)
            print("✅ Opened: How we can help you?")
        except Exception as e:
            self.fail(f"❌ Failed to open question 1: {str(e)}")

        # Open second question
        try:
            q2 = driver.find_element(By.XPATH, "//button[span[text()='Attorney with experience']]")
            q2.click()
            time.sleep(1)
            print("✅ Opened: Attorney with experience")
        except Exception as e:
            self.fail(f"❌ Failed to open question 2: {str(e)}")

        # Close first question
        try:
            q1.click()
            time.sleep(1)
            print("✅ Closed: How we can help you?")
        except Exception as e:
            self.fail(f"❌ Failed to close question 1: {str(e)}")

        # Close second question
        try:
            q2.click()
            time.sleep(1)
            print("✅ Closed: Attorney with experience")
        except Exception as e:
            self.fail(f"❌ Failed to close question 2: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
