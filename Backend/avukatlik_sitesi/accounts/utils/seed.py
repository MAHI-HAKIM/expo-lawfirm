from accounts.models import CustomUser, Lawyer
from django.contrib.auth import get_user_model
import os

User = get_user_model()

def create_seed_users():
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    lawyer_email = os.getenv("LAWYER_EMAIL")
    lawyer_password = os.getenv("LAWYER_PASSWORD")
    lawyer_name = os.getenv("LAWYER_NAME", "Default Lawyer")

    if not User.objects.filter(email=admin_email).exists():
        print("🧪 Admin kullanıcısı oluşturuluyor...")
        User.objects.create_superuser(
            email=admin_email,
            password=admin_password,
            full_name="Süper Admin",
            role="admin"
        )

    if not User.objects.filter(email=lawyer_email).exists():
        print("🧪 Lawyer kullanıcısı oluşturuluyor...")
        lawyer_user = User.objects.create_user(
            email=lawyer_email,
            password=lawyer_password,
            full_name=lawyer_name,
            role="lawyer"
        )
        Lawyer.objects.create(
            user=lawyer_user,
            specialization="Ceza Hukuku",
            bio="Ceza davalarında 10 yıllık deneyim"
        )
