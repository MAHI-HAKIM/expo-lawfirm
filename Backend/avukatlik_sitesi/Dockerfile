# Python imajı
FROM python:3.11

RUN apt-get update && apt-get install -y dos2unix
# Çalışma dizini
WORKDIR /app

# Gereksinimler
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Projeyi kopyala
COPY . .
COPY entrypoint.sh /entrypoint.sh
# Entrypoint scriptini kopyala ve çalıştırılabilir yap
RUN dos2unix /entrypoint.sh && chmod +x /entrypoint.sh

# Entrypoint betiğini çalıştır
ENTRYPOINT ["/entrypoint.sh"]

# Django başlangıç komutu (docker-compose üzerinden override edilecek)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
