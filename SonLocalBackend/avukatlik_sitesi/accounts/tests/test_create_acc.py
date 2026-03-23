from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterInvalidDataTestCase(APITestCase):
    def setUp(self):
        self.url = reverse("register")

    def test_register_with_missing_email(self):
        payload = {
            "password": "StrongPass123",
            "full_name": "Ali Yılmaz",
            "phone": "05399233294"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_with_missing_password(self):
        payload = {
            "email": "test@example.com",
            "full_name": "Ali Yılmaz",
            "phone": "05399233294"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_with_empty_payload(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_weak_password(self):
        payload = {
            "email": "user@example.com",
            "password": "123",
            "full_name": "Ali Yılmaz",
            "phone": "05399233294"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_email_format(self):
        payload = {
            "email": "not-an-email",
            "password": "StrongPass123",
            "full_name": "Ali Yılmaz",
            "phone": "05399233294"
        }
        response = self.client.post(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
