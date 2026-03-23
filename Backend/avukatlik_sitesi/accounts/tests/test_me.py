from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

User = get_user_model()

class MeEndpointTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="me@example.com",
            password="StrongPass123",
            full_name="Ali Demir",
            phone = "05839582837"
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.me_url = reverse("me")  # URL'de name="me" olmalı

    def test_me_endpoint_returns_user_info(self):
        response = self.client.get(self.me_url, HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)
        self.assertEqual(response.data["phone"], self.user.phone)
        self.assertEqual(response.data["full_name"], self.user.full_name)

    def test_me_endpoint_requires_authentication(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
