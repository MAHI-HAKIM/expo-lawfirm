from rest_framework import generics, permissions,status
from .serializers import AppointmentSerializer,UnavailableTimeSerializer,AppointmentListSerializer,AdminUnavailableTimeSerializer
from .serializers import AdminAppointmentListSerializer
from accounts.models import Client,Lawyer
from .models import Appointment, UnavailableTime
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import time, datetime 
from accounts.permissions import IsLawyer,IsAdmin
from rest_framework import serializers


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Giriş yapan kullanıcıya karşılık gelen Client objesini bul
        try:
            client = Client.objects.get(pk=self.request.user.pk)
        except Client.DoesNotExist:
            raise serializers.ValidationError("Bu kullanıcı bir client değil.")

        serializer.save(client=client)




class AvailableTimeView(APIView):
    permission_classes = [permissions.AllowAny]  # Giriş yapmadan görüntülenebilir

    def get(self, request):
        lawyer_id = request.query_params.get("lawyer_id")
        date_str = request.query_params.get("date")  # YYYY-MM-DD

        if not lawyer_id or not date_str:
            return Response({"error": "lawyer_id ve date zorunludur."}, status=400)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Tarih formatı yanlış. Doğru format: YYYY-MM-DD"}, status=400)

        try:
            lawyer = Lawyer.objects.get(pk=lawyer_id)
        except Lawyer.DoesNotExist:
            return Response({"error": "Avukat bulunamadı."}, status=404)

        # ⛔ Tüm gün unavailable mı?
        if UnavailableTime.objects.filter(lawyer=lawyer.user, date=date_obj, full_day=True).exists():
            return Response({"available_times": []})

        # Varsayılan çalışma saatleri
        work_hours = [time(h, 0) for h in range(9, 17)]

        # ⛔ UnavailableTime (saat bazlı)
        unavailable_times = UnavailableTime.objects.filter(
            lawyer=lawyer.user, date=date_obj, full_day=False
        ).values_list("time", flat=True)

        # ⛔ Daha önce alınmış randevular
        taken_times = Appointment.objects.filter(
            lawyer=lawyer, date=date_obj
        ).values_list("time", flat=True)

        # 🎯 Müsait saatler = Çalışma saatleri - unavailable - alınmış
        available = [
            t.strftime("%H:%M")
            for t in work_hours
            if t not in unavailable_times and t not in taken_times
        ]

        return Response({"available_times": available}, status=200)
    
    

    
    
class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Giriş yapan client'e ait randevuları getir
        return Appointment.objects.filter(client__user=self.request.user).order_by('-date', '-time')


class CancelAppointmentView(generics.UpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sadece kendi randevularına erişim
        return Appointment.objects.filter(client__user=self.request.user)

    def patch(self, request, *args, **kwargs):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Randevu iptal edildi.'}, status=status.HTTP_200_OK)

class UnavailableTimeCreateView(generics.CreateAPIView):
    serializer_class = UnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated,IsLawyer]

    def perform_create(self, serializer):
        # request.user → Lawyer modeliyle eşleştir
        lawyer_profile = Lawyer.objects.get(user=self.request.user)
        serializer.save(lawyer=lawyer_profile.user)  # modelde ForeignKey(CustomUser)
        
class UnavailableTimeListView(generics.ListAPIView):
    serializer_class = UnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated, IsLawyer]

    def get_queryset(self):
        # Sadece giriş yapan avukatın kayıtları
        return UnavailableTime.objects.filter(lawyer=self.request.user).order_by('-date', '-time')

class UnavailableTimeDeleteView(generics.DestroyAPIView):
    serializer_class = UnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated,IsLawyer]

    def get_queryset(self):
        # Kendi oluşturduğu kaydı silebilir
        return UnavailableTime.objects.filter(lawyer=self.request.user)


class AdminCreateUnavailableTimeView(generics.CreateAPIView):
    queryset = UnavailableTime.objects.all()
    serializer_class = AdminUnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdmin]

class UnavailableTimesByLawyerView(generics.ListAPIView):
    serializer_class = UnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdmin]

    def get_queryset(self):
        lawyer_id = self.kwargs.get("lawyer_id")
        return UnavailableTime.objects.filter(lawyer__id=lawyer_id)

class DeleteUnavailableTimeView(generics.DestroyAPIView):
    queryset = UnavailableTime.objects.all()
    serializer_class = UnavailableTimeSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    lookup_field = 'pk'  # id'ye göre sil


class AdminAppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.select_related('client__user', 'lawyer__user').all()
    serializer_class = AdminAppointmentListSerializer
    permission_classes = [permissions.IsAuthenticated,IsAdmin]
    
    
    
    
class LawyerAppointmentStatusUpdateView(generics.UpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsLawyer | IsAdmin]

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, "lawyer_profile"):
            # Lawyer'sa sadece kendi randevularını alabilir
            return Appointment.objects.filter(lawyer__user=user)

        if user.role == "admin":
            # Admin ise tüm randevulara erişebilir
            return Appointment.objects.all()

        # Diğer kullanıcılar hiçbir randevuyu göremez
        return Appointment.objects.none()

    def patch(self, request, *args, **kwargs):
        appointment = self.get_object()

        if appointment.status != 'pending':
            return Response(
                {"error": "Sadece bekleyen (pending) randevular güncellenebilir."},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_status = request.data.get("status")
        if new_status not in ['approved', 'cancelled']:
            return Response(
                {"error": "Geçersiz durum. Sadece 'approved' veya 'cancelled' olabilir."},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.status = new_status
        appointment.save()
        return Response({"message": f"Randevu {new_status} olarak güncellendi."})


