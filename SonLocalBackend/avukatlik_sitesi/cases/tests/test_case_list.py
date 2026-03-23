from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointment.models import Lawyer, Client, Appointment
from cases.models import Case
from datetime import date, time

User = get_user_model()

class CaseListViewTests(APITestCase):
    def setUp(self):
        self.list_url = reverse("case-list")
        self.detail_url = reverse("case-list-detail")

        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)

        self.client_user = User.objects.create_user(
            email="client@example.com", password="Client123", role="client"
        )
        self.client_user.phone = "0500000000"
        self.client_user.save()
        self.client_profile = Client.objects.create(user=self.client_user)

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
            title="Test Case",
            description="Test case description"
        )

    # --- CaseListView Tests ---

    def test_lawyer_can_list_their_cases(self):
        self.client.force_authenticate(user=self.lawyer_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.case.id)

    def test_client_can_list_their_cases(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.case.id)

    def test_unauthenticated_user_cannot_list_cases(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- CaseDetailListView Tests ---

    def test_lawyer_can_access_case_detail_list(self):
        self.client.force_authenticate(user=self.lawyer_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.case.id)
        self.assertIn("appointment", response.data[0])  # detay içeriği var mı?

    def test_client_cannot_access_case_detail_list(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_access_case_detail_list(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
