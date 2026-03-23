from django.urls import path
from accounts.views.auth_views import RegisterView,LogoutView,CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views.auth_views import (
    PasswordResetRequestView,
    PasswordResetConfirmView,
    AdminCreateLawyerView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    path('create-lawyer/', AdminCreateLawyerView.as_view(), name='admin-create-lawyer'),
]
  