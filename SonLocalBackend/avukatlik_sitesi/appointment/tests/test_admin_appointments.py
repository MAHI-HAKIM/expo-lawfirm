from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from appointment.models import Appointment, Lawyer, Client
from datetime import date, time

User = get_user_model()

class AdminAppointmentListTestCase(APITestCase):

    def setUp(self):
        self.client_api = APIClient()  # Test client'ı burada ezmiyoruz

        # Admin user
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="AdminPass123",
            role="admin",
            full_name="Admin User",
            is_staff=True,
            is_superuser=True
        )
        self.admin_token = str(RefreshToken.for_user(self.admin_user).access_token)

        # Lawyer user & profile
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com",
            password="LawyerPass123",
            role="lawyer",
            full_name="Lawyer Name"
        )
        self.lawyer = Lawyer.objects.create(user=self.lawyer_user, specialization="Ceza", bio="Avukat açıklama")

        # Client user & profile
        self.client_user = User.objects.create_user(
            email="client@example.com",
            password="ClientPass123",
            role="client",
            full_name="Client Name"
        )
        self.client_profile = Client.objects.create(user=self.client_user)

        # Appointment
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer,
            client=self.client_profile,
            date=date.today(),
            time=time(hour=10, minute=0),
            status="pending"
        )

        self.url = reverse("admin-appointments")

    def test_admin_can_view_all_appointments(self):
        self.client_api.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin_token}")
        response = self.client_api.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.appointment.id)

    def test_non_admin_cannot_access_admin_appointments(self):
        # Lawyer
        lawyer_token = str(RefreshToken.for_user(self.lawyer_user).access_token)
        self.client_api.credentials(HTTP_AUTHORIZATION=f"Bearer {lawyer_token}")
        response = self.client_api.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Client
        client_token = str(RefreshToken.for_user(self.client_user).access_token)
        self.client_api.credentials(HTTP_AUTHORIZATION=f"Bearer {client_token}")
        response = self.client_api.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_admin_appointments(self):
        self.client_api.credentials()  # Token kaldır
        response = self.client_api.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
