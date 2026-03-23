from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAuthFlowTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")  # name="register"
        self.login_url = reverse("login")        # name="login"

    def test_register_and_login_client(self):
        # Register client
        client_data = {
            "email": "client@example.com",
            "password": "ClientPass123",
            "full_name": "Ali Client",
            "phone": "0500000000"
        }
        register_response = self.client.post(self.register_url, client_data)
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        # Login client
        login_response = self.client.post(self.login_url, {
            "email": client_data["email"],
            "password": client_data["password"]
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        self.assertIn("refresh", login_response.data)

    def test_register_and_login_lawyer(self):
        # Only admin can register lawyers, so we simulate it here directly
        lawyer_user = User.objects.create_user(
            email="lawyer@example.com",
            password="LawyerPass123",
            role="lawyer"
        )

        # Login lawyer
        login_response = self.client.post(self.login_url, {
            "email": "lawyer@example.com",
            "password": "LawyerPass123"
        })
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)

    def test_token_authentication_for_protected_view(self):
        # Create and login client
        user = User.objects.create_user(
            email="protected@example.com",
            password="Protected123",
            role="client"
        )
        login = self.client.post(self.login_url, {
            "email": "protected@example.com",
            "password": "Protected123"
        })
        access_token = login.data["access"]

        # Access a protected view
        protected_url = reverse("appointment-list")  # user must be authenticated
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        response = self.client.get(protected_url)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN])  # list view might be empty or restricted by role

    def test_client_cannot_access_lawyer_only_view(self):
        # Register and login client
        client_user = User.objects.create_user(
            email="clientonly@example.com",
            password="Client123",
            role="client"
        )
        login = self.client.post(self.login_url, {
            "email": "clientonly@example.com",
            "password": "Client123"
        })
        token = login.data["access"]

        # Try to access a lawyer-only view
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        url = reverse("lawyer-appointments")  # only lawyers allowed
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
