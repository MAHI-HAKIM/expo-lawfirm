#!/bin/sh
set -e  # Hata durumunda betik dursun

echo "💡 Migration başlatılıyor..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "🌱 Seed veriler yükleniyor..."
python manage.py shell -c "from accounts.utils.seed import create_seed_users; create_seed_users()"

echo "🚀 Uygulama başlatılıyor...."
exec gunicorn avukatlik_sitesi.wsgi:application --bind 0.0.0.0:8000
