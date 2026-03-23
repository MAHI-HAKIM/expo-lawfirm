from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()

class LogoutTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="logout@example.com",
            password="StrongPass123"
        )
        refresh = RefreshToken.for_user(self.user)
        self.refresh_token = str(refresh)
        self.access_token = str(refresh.access_token)

        self.logout_url = reverse("logout")  # path() içinde name='logout' olmalı

    def test_logout_success(self):
        response = self.client.post(self.logout_url, {
            "refresh": self.refresh_token
        }, HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_without_token(self):
        response = self.client.post(self.logout_url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_with_invalid_token(self):
        response = self.client.post(self.logout_url, {
            "refresh": "invalid_refresh_token"
        }, HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
