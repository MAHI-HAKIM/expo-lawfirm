from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointment.models import Appointment, Lawyer, Client
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, time

User = get_user_model()

class AppointmentListAndCancelTestCase(APITestCase):

    def setUp(self):
        self.client_user = User.objects.create_user(
            email="client@example.com", password="ClientPass123", role="client"
        )
        self.client_user.phone = "0500000000"
        self.client_user.save()

        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="LawyerPass123", role="lawyer"
        )

        self.client_profile = Client.objects.create(user=self.client_user)
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)

        self.appointment = Appointment.objects.create(
            client=self.client_profile,
            lawyer=self.lawyer_profile,
            date=date.today(),
            time=time(hour=10, minute=0)
        )

        self.list_url = reverse("appointment-list")
        self.cancel_url = reverse("appointment-cancel", kwargs={"pk": self.appointment.id})

        self.client_token = str(RefreshToken.for_user(self.client_user).access_token)
        self.lawyer_token = str(RefreshToken.for_user(self.lawyer_user).access_token)


    def get_auth_header(self, token):
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    # ---- Appointment List View Tests ----

    def test_authenticated_client_can_list_own_appointments(self):
        response = self.client.get(self.list_url, **self.get_auth_header(self.client_token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.appointment.id)

    def test_unauthenticated_user_cannot_list_appointments(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ---- Appointment Delete View Tests ----

    def test_authenticated_client_can_cancel_own_appointment(self):
        response = self.client.patch(self.cancel_url, **self.get_auth_header(self.client_token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, "cancelled")

    def test_unauthenticated_user_cannot_cancel_appointment(self):
        response = self.client.delete(self.cancel_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_other_users_cannot_cancel_someone_elses_appointment(self):
        other_user = User.objects.create_user(email="other@example.com", password="pass", role="client")
        other_token = str(RefreshToken.for_user(other_user).access_token)
        response = self.client.patch(self.cancel_url, **self.get_auth_header(other_token))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
