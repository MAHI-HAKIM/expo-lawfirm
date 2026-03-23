from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class CustomTokenObtainPairViewTests(APITestCase):
    def setUp(self):
        self.login_url = reverse('login')
        self.email = 'test@example.com'
        self.password = 'StrongPass123'
        self.user = User.objects.create_user(
            email=self.email,
            password=self.password,
            first_name='Test',
            last_name='User'
        )

    def test_login_with_valid_credentials_returns_tokens(self):
        response = self.client.post(self.login_url, {
            'email': self.email,
            'password': self.password
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_with_invalid_credentials_returns_400(self):
        response = self.client.post(self.login_url, {
            'email': self.email,
            'password': 'WrongPassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('access', response.data)



class PasswordResetFlowTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="resetuser@example.com",
            password="InitialPass123"
        )
        self.reset_request_url = reverse("password-reset")
        self.reset_confirm_url = reverse("password-reset-confirm")

    def test_password_reset_request_valid_email(self):
        response = self.client.post(self.reset_request_url, {
            "email": self.user.email
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("uid", response.data)
        self.assertIn("token", response.data)

    def test_password_reset_request_invalid_email(self):
        response = self.client.post(self.reset_request_url, {
            "email": "nonexistent@example.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_confirm_valid_token(self):
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

    def test_password_reset_confirm_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post(self.reset_confirm_url, {
            "uid": uid,
            "token": "invalid-token",
            "new_password": "FakePass"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
