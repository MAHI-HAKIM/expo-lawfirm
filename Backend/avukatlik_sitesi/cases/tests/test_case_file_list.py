from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from accounts.models import Lawyer, Client
from appointment.models import Appointment
from cases.models import Case, CaseFile
from datetime import date, time, timedelta

User = get_user_model()

class CaseFileListViewTests(APITestCase):
    def setUp(self):
        # Users
        self.lawyer_user = User.objects.create_user(
            email="lawyer@example.com", password="Lawyer123", role="lawyer"
        )
        self.client_user = User.objects.create_user(
            email="client@example.com", password="Client123", role="client"
        )
        self.other_user = User.objects.create_user(
            email="other@example.com", password="Other123", role="lawyer"
        )

        # Profiles
        self.lawyer_profile = Lawyer.objects.create(user=self.lawyer_user)
        self.client_profile = Client.objects.create(user=self.client_user)

        # Appointment and Case
        self.appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today(),
            time=time(hour=9)
        )
        self.case = Case.objects.create(
            title="Ana Dava",
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            appointment=self.appointment,
            description="Dava"
        )

        # Case file
        self.test_file = SimpleUploadedFile("doc.txt", b"content", content_type="text/plain")
        self.case_file = CaseFile.objects.create(
            case=self.case,
            uploaded_by=self.lawyer_profile,
            file=self.test_file
        )

        self.url = reverse("case-file-list", kwargs={"case_id": self.case.id})

    def test_lawyer_can_list_case_files(self):
        self.client.force_authenticate(user=self.lawyer_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_client_can_list_case_files(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_unauthenticated_user_cannot_access_case_files(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_empty_file_list_returns_empty_array(self):
        # Yeni appointment ve case
        new_appointment = Appointment.objects.create(
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            date=date.today() + timedelta(days=1),
            time=time(hour=11)
        )
        other_case = Case.objects.create(
            title="Boş Dava",
            lawyer=self.lawyer_profile,
            client=self.client_profile,
            appointment=new_appointment,
            description="Empty Case"
        )
        url = reverse("case-file-list", kwargs={"case_id": other_case.id})
        self.client.force_authenticate(user=self.lawyer_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
