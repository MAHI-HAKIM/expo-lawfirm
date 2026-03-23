import os
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from appointment.models import Appointment
from accounts.models import Lawyer, Client
from cases.models import Case, CaseFile
from datetime import date, time

User = get_user_model()

class CaseFileDownloadTests(APITestCase):
    def setUp(self):
        # Kullanıcılar
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.client_user = User.objects.create_user(
            email="client@example.com", password="Client123", role="client"
        )

        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)
        self.client_profile = Client.objects.create(user=self.client_user)

        # Randevu ve Case
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today(),
            time=time(hour=10)
        )
        self.case = Case.objects.create(
            title="Test Case",
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            appointment=self.appointment,
            description="Test Description"
        )

        # Test dosyası oluştur
        self.test_file = SimpleUploadedFile(
            name="testfile.txt",
            content=b"Test content",
            content_type="text/plain"
        )

        self.case_file = CaseFile.objects.create(
            case=self.case,
            uploaded_by=self.lawyer_profile,
            file=self.test_file
        )

        self.download_url = reverse("case-file-download", kwargs={"pk": self.case_file.id})

    def test_lawyer_can_download_own_case_file(self):
        self.client.force_authenticate(user=self.lawyer_user)
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("attachment; filename=", response.get("Content-Disposition", ""))

    def test_download_fails_if_file_missing_on_disk(self):
        self.client.force_authenticate(user=self.lawyer_user)
        file_path = self.case_file.file.path

        if os.path.exists(file_path):
            os.remove(file_path)

        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_client_cannot_download_case_file(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_cannot_download(self):
        response = self.client.get(self.download_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_download_nonexistent_file_id_returns_404(self):
        self.client.force_authenticate(user=self.lawyer_user)
        url = reverse("case-file-download", kwargs={"pk": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def tearDown(self):
        try:
            if os.path.exists(self.case_file.file.path):
                os.remove(self.case_file.file.path)
        except Exception:
            pass
