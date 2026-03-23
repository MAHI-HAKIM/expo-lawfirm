from .serializers import (
CaseCreateSerializer,
CaseFileSerializer,
CaseSerializer,
CaseDetailSerializer
)
import os
from django.http import FileResponse, Http404
from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from accounts.permissions import IsLawyer
from .models import Case,CaseFile
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView

# Create your views here.
class CaseCreateView(generics.CreateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)  # sadece kayıt etsin
        return Response({
            "message": "✅ Case başarıyla oluşturuldu."
        }, status=status.HTTP_201_CREATED)
        
    def perform_create(self, serializer):
        appointment = serializer.validated_data.get("appointment")

        # Kullanıcı gerçekten bu appointment'ın lawyer'ı mı?
        if appointment.lawyer.user != self.request.user:
            raise PermissionDenied("Bu randevu için case oluşturma yetkiniz yok.")

        serializer.save()


# * Lawyer ve Client'in kendisi ile ilgili case'leri listelemesi için
class CaseListView(generics.ListAPIView):
    serializer_class = CaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'lawyer_profile'):
            return Case.objects.filter(lawyer=user.lawyer_profile)
        elif hasattr(user, 'client_profile'):
            return Case.objects.filter(client=user.client_profile)
        return Case.objects.none()

# * Lawyer'in detaylıca case'leri listelemesi için.
class CaseDetailListView(generics.ListAPIView):
    serializer_class = CaseDetailSerializer
    permission_classes = [permissions.IsAuthenticated,IsLawyer]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'lawyer_profile'):
            return Case.objects.filter(lawyer=user.lawyer_profile)
        return Case.objects.none()


class CaseFileUploadView(generics.CreateAPIView):
    queryset = CaseFile.objects.all()
    serializer_class = CaseFileSerializer
    permission_classes = [permissions.IsAuthenticated, IsLawyer]

    def ceate(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        return Response({
            "message": "✅ Case file başarıyla yüklendi."
        }, status=status.HTTP_201_CREATED)
        
    def perform_create(self, serializer):
        user = self.request.user
        case = self.request.data.get('case')

        try:
            case_instance = Case.objects.get(pk=case)
        except Case.DoesNotExist:
            raise PermissionDenied("İlgili dava bulunamadı.")

        if not hasattr(user, 'lawyer_profile') or case_instance.lawyer != user.lawyer_profile:
            raise PermissionDenied("Bu dava'nin avakati siz degilsiniz.")

        serializer.save(uploaded_by=user.lawyer_profile, case=case_instance)
        
        
class CaseFileListView(generics.ListAPIView):
    serializer_class = CaseFileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # * asagidaki kwargs url'deki case_id'yi alir. localhost:8000/case-files/upload/1
        case_id = self.kwargs['case_id']
        return CaseFile.objects.filter(case_id=case_id)
    
    
class CaseFileDownloadView(APIView):
    permission_classes = [IsAuthenticated, IsLawyer]

    def get(self, request, pk):
        try:
            case_file = CaseFile.objects.get(pk=pk)
        except CaseFile.DoesNotExist:
            raise Http404("Dosya bulunamadı")

        file_path = case_file.file.path
        if not os.path.exists(file_path):
            raise Http404("Dosya bulunamadı")

        return FileResponse(open(file_path, 'rb'), as_attachment=True)