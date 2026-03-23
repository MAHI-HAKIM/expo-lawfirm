from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointments.models import Lawyer, Client, Appointment
from cases.models import Case
from datetime import date, time

User = get_user_model()

class AccessControlEdgeCasesTests(APITestCase):
    def setUp(self):
        # Create users
        self.client_user = User.objects.create_user(
            email="client@example.com", password="Client123", role="client"
        )
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.other_user = User.objects.create_user(
            email="random@example.com", password="Other123", role="client"
        )

        # Profiles
        self.client_profile = Client.objects.create(user=self.client_user, phone="0500000000")
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)

        # Appointment and Case
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today(),
            time=time(hour=9)
        )
        self.case = Case.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            appointment=self.appointment,
            description="Edge Case"
        )

        # Login tokens
        login = self.client.post(reverse("login"), {
            "email": "client@example.com", "password": "Client123"
        })
        self.client_token = login.data["access"]

        login = self.client.post(reverse("login"), {
            "email": "lawyer@example.com", "password": "Lawyer123"
        })
        self.lawyer_token = login.data["access"]

        login = self.client.post(reverse("login"), {
            "email": "random@example.com", "password": "Other123"
        })
        self.other_token = login.data["access"]

    def test_client_cannot_create_case(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        response = self.client.post(reverse("case-create"), {
            "appointment": self.appointment.id,
            "description": "Client should not be able to create case"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_cannot_upload_file(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        response = self.client.post(reverse("case-file-upload"), {
            "case": self.case.id,
            "file": None
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unrelated_user_cannot_cancel_appointment(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.other_token}")
        cancel_url = reverse("appointment-cancel", kwargs={"pk": self.appointment.id})
        response = self.client.delete(cancel_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_client_cannot_access_case_detail_list(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        url = reverse("case-detail-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_access_to_protected_route_fails(self):
        url = reverse("appointment-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
