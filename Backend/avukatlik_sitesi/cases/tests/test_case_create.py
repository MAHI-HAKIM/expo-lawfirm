from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from appointment.models import Appointment
from accounts.models import Client, Lawyer
from cases.models import Case
from datetime import date, time, timedelta
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CaseCreateTests(APITestCase):

    def setUp(self):
        # Kullanıcılar
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="123", role="lawyer"
        )
        self.client_user = User.objects.create_user(
            email="client@example.com", password="123", role="client"
        )

        # Profil modelleri
        self.lawyer_profile = Lawyer.objects.create(
            user=self.lawyer_user, specialization="Ceza", bio="Avukat"
        )
        self.client_profile = Client.objects.create(
            user=self.client_user
        )

        # Randevu oluştur
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today() + timedelta(days=1),
            time=time(hour=10, minute=0)
        )

        self.url = reverse("case-create")
        self.lawyer_token = str(RefreshToken.for_user(self.lawyer_user).access_token)
        self.client_token = str(RefreshToken.for_user(self.client_user).access_token)

    def get_auth_header(self, token):
        return {"HTTP_AUTHORIZATION": f"Bearer {token}"}

    def test_lawyer_can_create_case(self):
        payload = {
            "title": "Test Case",
            "description": "Test açıklama",
            "appointment": self.appointment.id
        }

        response = self.client.post(self.url, payload, **self.get_auth_header(self.lawyer_token))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Case.objects.count(), 1)

    def test_client_cannot_create_case(self):
        payload = {
            "title": "Yetkisiz",
            "description": "Client bunu yapamaz",
            "appointment": self.appointment.id
        }

        response = self.client.post(self.url, payload, **self.get_auth_header(self.client_token))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_case_cannot_be_created_twice_for_same_appointment(self):
        # İlk case oluştur
        Case.objects.create(
            title="Zaten Var",
            description="Deneme",
            appointment=self.appointment,
            lawyer=self.lawyer_profile,
            client=self.client_profile
        )

        payload = {
            "title": "İkinci Giriş",
            "description": "Olmamalı",
            "appointment": self.appointment.id
        }

        response = self.client.post(self.url, payload, **self.get_auth_header(self.lawyer_token))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("case with this appointment already exists", str(response.data))
