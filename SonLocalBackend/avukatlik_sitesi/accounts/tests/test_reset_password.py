from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

User = get_user_model()

class ResetPasswordFlowTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="resetuser@example.com",
            password="OldPassword123"
        )
        self.reset_request_url = reverse("password-reset")
        self.reset_confirm_url = reverse("password-reset-confirm")

    def test_reset_request_valid_email(self):
        response = self.client.post(self.reset_request_url, {
            "email": self.user.email
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("uid", response.data)
        self.assertIn("token", response.data)

    def test_reset_request_invalid_email(self):
        response = self.client.post(self.reset_request_url, {
            "email": "nonexistent@example.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_confirm_valid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)

        response = self.client.post(self.reset_confirm_url, {
            "uid": uid,
            "token": token,
            "new_password": "NewSecurePass456"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecurePass456"))

    def test_reset_confirm_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        invalid_token = "invalid-token"

        response = self.client.post(self.reset_confirm_url, {
            "uid": uid,
            "token": invalid_token,
            "new_password": "Whatever123"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
