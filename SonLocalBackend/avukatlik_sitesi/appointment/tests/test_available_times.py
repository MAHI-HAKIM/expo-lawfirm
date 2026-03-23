from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from datetime import date
from appointment.models import Lawyer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AvailableTimeViewTestCase(APITestCase):

    def setUp(self):
        self.url = reverse("available-times")

        # Client user
        self.client_user = User.objects.create_user(
            email="client@example.com",
            password="ClientPass123",
            role="client"
        )

        # Lawyer user
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com",
            password="LawyerPass123",
            role="lawyer"
        )
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)

        # JWT token
        refresh = RefreshToken.for_user(self.client_user)
        self.access_token = str(refresh.access_token)

    def auth_header(self):
        return {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def test_available_times_authenticated(self):
        query_date = "2025-05-13"
        response = self.client.get(
            self.url,
            {"lawyer_id": self.lawyer_user.id, "date": query_date},
            **self.auth_header()
        )
        self.assertIn(response.status_code, [200, 404])  # 404 olabilir, lawyer o tarihte yoksa


    def test_missing_query_params_returns_400(self):
        response = self.client.get(self.url, **self.auth_header())
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_invalid_date_format_returns_400(self):
        response = self.client.get(
            self.url,
            {"lawyer_id": self.lawyer_user.id, "date": "13-05-2025"},
            **self.auth_header()
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_lawyer_not_found_returns_404(self):
        response = self.client.get(
            self.url,
            {"lawyer_id": 9999, "date": "2025-05-13"},
            **self.auth_header()
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_returns_default_working_hours_if_nothing_blocked(self):
        today_str = date.today().strftime("%Y-%m-%d")
        response = self.client.get(
            self.url,
            {"lawyer_id": self.lawyer_user.id, "date": today_str},
            **self.auth_header()
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("available_times", response.data)
        self.assertIsInstance(response.data["available_times"], list)
