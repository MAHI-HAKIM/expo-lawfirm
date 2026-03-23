from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from appointments.models import Appointment, Lawyer, Client
from cases.models import Case
from datetime import date, time

User = get_user_model()

class AppointmentCaseIntegrationTests(APITestCase):

    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.create_appointment_url = reverse("appointment-create")
        self.create_case_url = reverse("case-create")

        # Register and login client
        client_data = {
            "email": "client@example.com",
            "password": "Client123",
            "full_name": "Ali Client",
            "phone": "0500000000"
        }
        self.client.post(self.register_url, client_data)
        login = self.client.post(self.login_url, {
            "email": client_data["email"],
            "password": client_data["password"]
        })
        self.client_token = login.data["access"]

        # Create lawyer manually (admin flow not tested here)
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com",
            password="Lawyer123",
            role="lawyer"
        )
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)
        self.lawyer_user.refresh_from_db()

        # Create client profile manually
        self.client_user = User.objects.get(email=client_data["email"])
        self.client_profile = Client.objects.create(user=self.client_user, phone="0500000000")

    def test_client_creates_appointment_and_lawyer_creates_case(self):
        # Step 1: Client creates an appointment
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        appointment_data = {
            "lawyer": self.lawyer_profile.id,
            "appointment_time": f"{date.today().isoformat()}T09:00"
        }
        response = self.client.post(self.create_appointment_url, appointment_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 1)
        appointment_id = Appointment.objects.first().id

        # Step 2: Lawyer logs in and creates case
        login = self.client.post(self.login_url, {
            "email": "lawyer@example.com",
            "password": "Lawyer123"
        })
        lawyer_token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {lawyer_token}")

        case_data = {
            "appointment": appointment_id,
            "description": "Yeni dava açıldı"
        }
        case_response = self.client.post(self.create_case_url, case_data)
        self.assertEqual(case_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Case.objects.count(), 1)

    def test_lawyer_cannot_create_case_for_unrelated_appointment(self):
        # Lawyer logs in
        login = self.client.post(self.login_url, {
            "email": "lawyer@example.com",
            "password": "Lawyer123"
        })
        lawyer_token = login.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {lawyer_token}")

        # Create unrelated appointment manually for test
        unrelated_client = User.objects.create_user(
            email="client2@example.com", password="pass", role="client"
        )
        unrelated_client_profile = Client.objects.create(user=unrelated_client, phone="0500000001")
        unrelated_lawyer_user = User.objects.create_user(
            email="lawyer2@example.com", password="pass", role="lawyer"
        )
        unrelated_lawyer_profile = Lawyer.objects.create(user=unrelated_lawyer_user)

        appointment = Appointment.objects.create(
            lawyer=unrelated_lawyer_profile,
            client=unrelated_client_profile,
            date=date.today(),
            time=time(hour=10)
        )

        # Try to create a case for this unrelated appointment
        data = {
            "appointment": appointment.id,
            "description": "Yetkisiz dava"
        }
        response = self.client.post(self.create_case_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
