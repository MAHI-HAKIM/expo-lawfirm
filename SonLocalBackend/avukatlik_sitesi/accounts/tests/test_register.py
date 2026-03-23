from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterTestCase(APITestCase):

    def setUp(self):
        self.url = reverse("register") 
        self.valid_payload = {
            "email": "user@example.com",
            "password": "StrongPassword123",
            "full_name": "Ali Yılmaz",
            "phone": "05399233294"
        }

    def test_register_user_successfully(self):
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, self.valid_payload["email"])

    def test_register_user_with_existing_email(self):
        User.objects.create_user(email=self.valid_payload["email"], password="SomePass")
        response = self.client.post(self.url, self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_missing_fields(self):
        invalid_payload = {
            "email": "",
            "password": "StrongPassword123"
        }
        response = self.client.post(self.url, invalid_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
