from django.db import models
from accounts.models import CustomUser
from accounts.models import Client, Lawyer

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('cancelled', 'Cancelled'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
    ]

    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='appointments')
    lawyer = models.ForeignKey(Lawyer, on_delete=models.SET_NULL, null=True, related_name='appointments')
    case = models.OneToOneField("cases.Case", on_delete=models.SET_NULL, null=True, blank=True, related_name="appointment_of")
    date = models.DateField()
    time = models.TimeField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # 👇 Yeni status alanı
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Randevu: {self.client.user.email} → {self.lawyer.user.email} | {self.date} - {self.time}"



class UnavailableTime(models.Model):
    lawyer = models.ForeignKey(CustomUser,  on_delete=models.CASCADE, related_name='unavailable_times')
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)  # sadece saat belirtilmişse kullanılır
    full_day = models.BooleanField(default=False)   # 👈 yeni alan

    def __str__(self):
        if self.full_day:
            return f"{self.lawyer.email} - {self.date} (Tüm gün uygun değil)"
        return f"{self.lawyer.email} - {self.date} {self.time} (Uygun değil)"
