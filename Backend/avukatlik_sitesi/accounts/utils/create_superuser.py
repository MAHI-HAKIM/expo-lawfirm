
# ! Normalde admin panelini kullanmak için admin seed datası gömüyordum.
# ! Ancak frontend ayrı tasarlanacaksa gerek yok diyordu o yüzden kaldırdım.

from django.contrib.auth import get_user_model
import os

User = get_user_model()

email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
full_name = os.environ.get("DJANGO_SUPERUSER_FULLNAME")

if not User.objects.filter(is_superuser=True).exists():
    print("✅ Süper kullanıcı oluşturuluyor...")
    user = User.objects.create_superuser(
        email=email,
        password=password,
        full_name=full_name
    )
    user.role = "admin"
    user.save()
else:
    print("ℹ️ Süper kullanıcı zaten mevcut.")
