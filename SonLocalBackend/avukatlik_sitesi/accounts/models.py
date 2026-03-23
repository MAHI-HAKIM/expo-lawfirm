from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email alanı zorunludur")
        
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email)  # ✨ username = email
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


# * Burada python'un hazır AuthUser modelini kullanarak giriş işlemlerini yapıyoruz.
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('lawyer', 'Lawyer'),
        ('client', 'Client'),
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=11, blank=True)  # ✅ Buraya eklendi
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']  # Süperuser oluştururken istenecek
    objects = CustomUserManager()
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    
class Lawyer(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="lawyer_profile",
        primary_key=True  # 👈 bu satır kritik!
    )
    specialization = models.CharField(max_length=255)
    bio = models.TextField(blank=True)

class Client(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="client_profile", primary_key=True)