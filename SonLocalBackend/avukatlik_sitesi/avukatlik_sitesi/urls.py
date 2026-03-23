"""
URL configuration for avukatlik_sitesi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #!token
    # path('admin/', admin.site.urls), # admin enpoint'inin kullanılmasını istemediğimden bu enpoint'i kaldırdım.
    path('api/auth/', include('accounts.urls.auth_urls')), # auth urls
    path('api/users/', include('accounts.urls.users_urls')), # auth urls
    path('api/appointments/', include('appointment.urls')),
    path('api/cases/', include('cases.urls')),

    
    # OpenAPI şeması
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Redoc UI
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# * Normalde aşağıdaki satır http://localhost:8000/media/... üzerinden dosya erişimi sağlar.
# * Ancak herkes tarafından erişilebildiğinden güvenli bir enpointi ile sunmak için
# * aşağıki satırı kaldırdım.
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
