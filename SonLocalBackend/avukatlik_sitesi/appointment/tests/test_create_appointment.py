from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointment.models import Appointment, Lawyer,Client
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, timedelta

User = get_user_model()

class AppointmentCreateTestCase(APITestCase):

    def setUp(self):
        self.client_user = User.objects.create_user(
        email="client@example.com",
        password="ClientPass123",
        role="client",
        full_name="Test Client"
    )
        self.client_profile = Client.objects.create(user=self.client_user) 

        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com",
            password="LawyerPass123",
            role="lawyer"
        )
        self.lawyer = Lawyer.objects.create(user=self.lawyer_user)

        self.url = reverse("appointment-create")

        refresh = RefreshToken.for_user(self.client_user)
        self.access_token = str(refresh.access_token)

    def auth_header(self):
        return {"HTTP_AUTHORIZATION": f"Bearer {self.access_token}"}

    def test_create_appointment_success(self):
        future_date = (date.today() + timedelta(days=2)).isoformat()
        data = {
            "lawyer": self.lawyer.user.id,  # Lawyer modelinin pk'si
            "date": future_date,
            "time": "11:00:00"  # Güvenli saat
        }

        response = self.client.post(self.url, data, **self.auth_header())
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 1)

    def test_create_appointment_unauthenticated(self):
        future_date = (date.today() + timedelta(days=1)).isoformat()
        data = {
            "lawyer": self.lawyer.user.id,
            "date": future_date,
            "time": "10:00:00"
        }

        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_appointment_with_invalid_data(self):
        response = self.client.post(self.url, {}, **self.auth_header())
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("lawyer", response.data)
        self.assertIn("date", response.data)
        self.assertIn("time", response.data)
