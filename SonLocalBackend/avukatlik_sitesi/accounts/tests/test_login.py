from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class LoginTestCase(APITestCase):

    def setUp(self):
        self.login_url = reverse("login")  # URL'inde name="login" olmalı
        self.email = "test@example.com"
        self.password = "StrongPass123"
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password,
            first_name="Ali",
            last_name="Yılmaz"
        )

    def test_login_success(self):
        data = {
            "email": self.email,
            "password": self.password
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        data = {
            "email": self.email,
            "password": "WrongPass"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_nonexistent_user(self):
        data = {
            "email": "nonexistent@example.com",
            "password": "somepassword"
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_empty_fields(self):
        data = {
            "email": "",
            "password": ""
        }
        response = self.client.post(self.login_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
