from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointment.models import Lawyer, UnavailableTime
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date, time

User = get_user_model()

class UnavailableTimeTests(APITestCase):

    def setUp(self):
        # Lawyer user
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="LawyerPass123", role="lawyer"
        )
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user, specialization="Ceza", bio="...")

        # Client user
        self.client_user = User.objects.create_user(
            email="client@example.com", password="ClientPass123", role="client"
        )

        self.create_url = reverse("unavailable-create")
        self.list_url = reverse("unavailable-list")

        self.lawyer_token = str(RefreshToken.for_user(self.lawyer_user).access_token)
        self.client_token = str(RefreshToken.for_user(self.client_user).access_token)

    def auth(self, token):
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    # --- Create Tests ---

    def test_lawyer_can_create_unavailable_time(self):
        payload = {
            "date": date.today().isoformat(),
            "time": "10:00",
            "full_day": False
        }
        response = self.client.post(self.create_url, payload, **self.auth(self.lawyer_token))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UnavailableTime.objects.count(), 1)

    def test_non_lawyer_cannot_create_unavailable_time(self):
        payload = {
            "date": date.today().isoformat(),
            "time": "10:00",
            "full_day": False
        }
        response = self.client.post(self.create_url, payload, **self.auth(self.client_token))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_create_unavailable_time(self):
        response = self.client.post(self.create_url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- List Tests ---

    def test_lawyer_can_list_own_unavailable_times(self):
        UnavailableTime.objects.create(
            lawyer=self.lawyer_user,
            date=date.today(),
            time=time(hour=9, minute=0),
            full_day=False
        )
        response = self.client.get(self.list_url, **self.auth(self.lawyer_token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_non_lawyer_cannot_list_unavailable_times(self):
        response = self.client.get(self.list_url, **self.auth(self.client_token))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



    def test_lawyer_cannot_delete_others_unavailable_time(self):
        other_lawyer_user = User.objects.create_user(
            email="otherlawyer@example.com", password="pass", role="lawyer"
        )
        Lawyer.objects.create(user=other_lawyer_user)
