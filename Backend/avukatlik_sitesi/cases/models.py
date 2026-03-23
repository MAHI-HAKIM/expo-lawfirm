from django.db import models
from accounts.models import Client, Lawyer

# Create your models here.

class Case(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    lawyer = models.ForeignKey(Lawyer, on_delete=models.SET_NULL,null=True, related_name="cases_as_lawyer")
    client = models.ForeignKey(Client, on_delete=models.SET_NULL,null=True ,related_name="cases_as_client")
    appointment = models.OneToOneField("appointment.Appointment", on_delete=models.SET_NULL, null=True, blank=True, related_name="related_case")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Case: {self.title} | {self.client.user.email} vs {self.lawyer.user.email}"
    
    

class CaseFile(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='case_files')
    file = models.FileField(upload_to='case_files/')
    uploaded_by = models.ForeignKey(Lawyer, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"Dosya: {self.file.name}"
