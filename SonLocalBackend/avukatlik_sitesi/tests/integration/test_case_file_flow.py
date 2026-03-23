from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from appointments.models import Lawyer, Client, Appointment
from cases.models import Case, CaseFile
from datetime import date, time
import os

User = get_user_model()

class CaseFileFlowTests(APITestCase):
    def setUp(self):
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.appointment_url = reverse("appointment-create")
        self.case_create_url = reverse("case-create")
        self.file_upload_url = reverse("case-file-upload")

        # Register client
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
        self.client_user = User.objects.get(email=client_data["email"])
        self.client_profile = Client.objects.create(user=self.client_user, phone="0500000000")

        # Create lawyer
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)

        # Client creates appointment
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        appointment_data = {
            "lawyer": self.lawyer_profile.id,
            "appointment_time": f"{date.today().isoformat()}T09:00"
        }
        response = self.client.post(self.appointment_url, appointment_data)
        self.appointment_id = response.data["id"]

        # Lawyer logs in
        login = self.client.post(self.login_url, {
            "email": "lawyer@example.com",
            "password": "Lawyer123"
        })
        self.lawyer_token = login.data["access"]

        # Lawyer creates case
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.lawyer_token}")
        case_data = {
            "appointment": self.appointment_id,
            "description": "Case for file test"
        }
        case_response = self.client.post(self.case_create_url, case_data)
        self.case = Case.objects.first()

    def test_file_upload_list_and_download_flow(self):
        # Lawyer uploads file
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.lawyer_token}")
        file = SimpleUploadedFile("evidence.txt", b"Case file content")
        upload_response = self.client.post(self.file_upload_url, {
            "case": self.case.id,
            "file": file
        }, format="multipart")
        self.assertEqual(upload_response.status_code, status.HTTP_201_CREATED)
        case_file = CaseFile.objects.first()

        # Lawyer lists case files
        list_url = reverse("case-file-list", kwargs={"case_id": self.case.id})
        list_response = self.client.get(list_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)

        # Lawyer downloads file
        download_url = reverse("case-file-download", kwargs={"pk": case_file.id})
        download_response = self.client.get(download_url)
        self.assertEqual(download_response.status_code, status.HTTP_200_OK)
        self.assertIn("attachment", download_response.get("Content-Disposition"))

        # Client lists files
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.client_token}")
        client_list = self.client.get(list_url)
        self.assertEqual(client_list.status_code, status.HTTP_200_OK)
        self.assertEqual(len(client_list.data), 1)

        # Client cannot download file
        client_download = self.client.get(download_url)
        self.assertEqual(client_download.status_code, status.HTTP_403_FORBIDDEN)

    def tearDown(self):
        # Clean up uploaded test files from disk
        for case_file in CaseFile.objects.all():
            if case_file.file and os.path.exists(case_file.file.path):
                os.remove(case_file.file.path)
