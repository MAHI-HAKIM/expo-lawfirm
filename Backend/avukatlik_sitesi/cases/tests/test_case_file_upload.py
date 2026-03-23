from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from accounts.models import Lawyer, Client
from appointment.models import Appointment
from cases.models import Case, CaseFile
from datetime import date, time

User = get_user_model()

class CaseFileUploadTests(APITestCase):
    def setUp(self):
        self.url = reverse("casefile-upload")

        # Users
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.client_user = User.objects.create_user(
            email="client@example.com", password="Client123", role="client"
        )
        self.other_lawyer_user = User.objects.create_user(
            email="otherlawyer@example.com", password="OtherLawyer123", role="lawyer"
        )

        # Profiles
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)
        self.other_lawyer_profile = Lawyer.objects.create(user=self.other_lawyer_user)
        self.client_profile = Client.objects.create(user=self.client_user)

        # Appointment and Case
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today(),
            time=time(hour=9)
        )
        self.case = Case.objects.create(
            title="Upload Dava",
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            appointment=self.appointment,
            description="Test Case"
        )

        self.test_file = SimpleUploadedFile("file.txt", b"case file content")

    def test_lawyer_can_upload_file_to_own_case(self):
        self.client.force_authenticate(user=self.lawyer_user)
        data = {
            "case": self.case.id,
            "file": self.test_file
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CaseFile.objects.count(), 1)

    def test_lawyer_cannot_upload_to_other_lawyers_case(self):
        self.client.force_authenticate(user=self.other_lawyer_user)
        data = {
            "case": self.case.id,
            "file": self.test_file
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(CaseFile.objects.count(), 0)

    def test_upload_to_nonexistent_case_returns_400(self):
        self.client.force_authenticate(user=self.lawyer_user)
        data = {
            "case": 999,  # yok
            "file": self.test_file
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # ✅ 403 değil, 400

    def test_client_cannot_upload_file(self):
        self.client.force_authenticate(user=self.client_user)
        data = {
            "case": self.case.id,
            "file": self.test_file
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_upload_file(self):
        data = {
            "case": self.case.id,
            "file": self.test_file
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
