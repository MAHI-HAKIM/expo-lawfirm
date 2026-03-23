from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from ..serializers import (UserUpdateSerializer,
                           ChangePasswordSerializer,
                           UserSerializer,
                           LawyerListSerializer,
                           UserDetailSerializer,
                           LawyerDetailSerializer)
from ..permissions import IsLawyer,IsAdmin
from django.contrib.auth import get_user_model
from ..models import Lawyer
from rest_framework.exceptions import NotFound



User = get_user_model()

class MeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Profil başarıyla güncellendi."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    
    
class SetUserRoleView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        role = request.data.get("role")

        if role not in ["admin", "client", "lawyer"]:
            return Response({"error": "Geçersiz rol."}, status=status.HTTP_400_BAD_REQUEST)

        user.role = role
        user.save()

        return Response({"detail": f"Kullanıcının rolü {role} olarak güncellendi."}, status=status.HTTP_200_OK)

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"detail": "Kullanıcı başarıyla silindi."}, status=status.HTTP_204_NO_CONTENT)
    
    
class LawyerListView(ListAPIView):
    queryset = Lawyer.objects.select_related('user').all()
    serializer_class = LawyerListSerializer
    permission_classes = [AllowAny]  # Gerekirse IsAuthenticated olarak değiştirilebilir
    
    
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Eski şifre doğru değil."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response({"message": "Şifreniz başarıyla güncellendi."}, status=status.HTTP_200_OK)
    
    

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'


class LawyerDetailView(generics.RetrieveAPIView):
    queryset = Lawyer.objects.select_related('user').all()
    serializer_class = LawyerDetailSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    lookup_field = 'pk'



class DeleteLawyerView(generics.DestroyAPIView):
    queryset = Lawyer.objects.all()
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        try:
            lawyer = self.get_object()
            user = lawyer.user
            lawyer.delete()
            user.delete()
            return Response({"message": "Lawyer başarıyla silindi."}, status=status.HTTP_204_NO_CONTENT)
        except Lawyer.DoesNotExist:
            raise NotFound("Belirtilen avukat bulunamadı.")
