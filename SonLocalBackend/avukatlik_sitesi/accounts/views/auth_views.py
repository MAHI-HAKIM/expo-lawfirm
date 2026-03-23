from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers import (RegisterSerializer
                           ,CustomTokenObtainPairSerializer
                           ,UserUpdateSerializer
                           ,UserSerializer
                           ,ChangePasswordSerializer,
                           AdminLawyerRegisterSerializer,
                           PasswordResetRequestSerializer,
                            PasswordResetConfirmSerializer,)
from ..permissions import IsLawyer,IsAdmin
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework import generics, permissions



# accounts/views/lawyer_views.py

User = get_user_model()

# * JWT token'i override ettiğimiz için serializer'i guncellemek icin view'i kullandik.
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Başarıyla çıkış yapıldı."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Kayıt başarılı!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Gerçekte burada e-posta atılır
        return Response({
            "message": "Şifre sıfırlama bağlantısı oluşturuldu.",
            "uid": uid,
            "token": token
        })


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Şifre başarıyla güncellendi."})






class AdminCreateLawyerView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminLawyerRegisterSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "Lawyer başarıyla oluşturuldu.",
            "email": user.email,
            "generated_password": user.generated_password
        }, status=status.HTTP_201_CREATED)




