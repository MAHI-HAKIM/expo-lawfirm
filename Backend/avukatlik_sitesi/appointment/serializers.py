from rest_framework import serializers
from .models import Appointment, UnavailableTime
from accounts.models import Lawyer
from accounts.models import CustomUser
from datetime import datetime, date, time


class AppointmentSerializer(serializers.ModelSerializer):
    lawyer = serializers.PrimaryKeyRelatedField(queryset=Lawyer.objects.all())
    client = serializers.PrimaryKeyRelatedField(read_only=True)  # perform_create’de bağlanacak

    
    # ! normalde client'i asagida tanimladigimizde post body'de cleint id bekliyor.
    # ! ancak biz bunu jwt token icerisinden aldigimizdan yukariadki alani ekledik.
    # ! boylece client alanini bizim kodda dolduracagimizi oylemis olduk.
    class Meta:
        model = Appointment
        fields = ['id', 'client', 'lawyer', 'case', 'date', 'time','description','status']


    def validate(self, attrs):
        lawyer = attrs.get('lawyer')
        date_ = attrs.get('date')
        time_ = attrs.get('time')

        if date_ < date.today():
            raise serializers.ValidationError("Geçmiş tarihe randevu alınamaz.")

        if date_ == date.today() and time_ <= datetime.now().time():
            raise serializers.ValidationError("Geçmiş saate randevu alınamaz.")

        if not time(9, 0) <= time_ <= time(16, 0):
            raise serializers.ValidationError("Randevular sadece 09:00 - 16:00 arasında alınabilir.")

        if UnavailableTime.objects.filter(lawyer=lawyer.user, date=date_, full_day=True).exists():
            raise serializers.ValidationError("Avukat bu tarihte tüm gün uygun değil.")

        if UnavailableTime.objects.filter(lawyer=lawyer.user, date=date_, time=time_, full_day=False).exists():
            raise serializers.ValidationError("Avukat bu saatte uygun değil.")

        # ✅ cancelled durumundakileri dışlayarak kontrol et
        if Appointment.objects.filter(
            lawyer=lawyer, date=date_, time=time_
        ).exclude(status='cancelled').exists():
            raise serializers.ValidationError("Bu saat için zaten bir randevu alınmış.")

        return attrs




class AppointmentListSerializer(serializers.ModelSerializer):
    lawyer_name = serializers.CharField(source="lawyer.user.full_name", read_only=True)
    case_title = serializers.CharField(source="case.title", read_only=True, default=None)

    class Meta:
        model = Appointment
        fields = ['id', 'lawyer', 'lawyer_name', 'case', 'case_title', 'date', 'time', 'created_at','description','status']

    


        
        

class UnavailableTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableTime
        fields = ['id', 'date', 'time', 'full_day']

    def validate(self, data):
        if not data.get("full_day") and not data.get("time"):
            raise serializers.ValidationError("Saat belirtmelisiniz ya da tüm günü kapatmalısınız.")
        return data


class AdminUnavailableTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnavailableTime
        fields = ['id','lawyer', 'date', 'time', 'full_day']


class AdminAppointmentListSerializer(serializers.ModelSerializer):
    client_id = serializers.IntegerField(source='client.user.id', read_only=True)
    lawyer_id = serializers.IntegerField(source='lawyer.user.id', read_only=True)
    
    client_full_name = serializers.CharField(source='client.user.full_name', read_only=True)
    client_email = serializers.EmailField(source='client.user.email', read_only=True)
    lawyer_full_name = serializers.CharField(source='lawyer.user.full_name', read_only=True)
    lawyer_email = serializers.EmailField(source='lawyer.user.email', read_only=True)
    lawyer_specialization = serializers.EmailField(source='lawyer.specialization', read_only=True)
    class Meta:
        model = Appointment
        fields = [
            'id',
            'date',
            'time',
            'created_at',
            'client_id',
            'client_full_name',
            'client_email',
            'lawyer_id',
            'lawyer_full_name',
            'lawyer_email',
            'description',
            'status',
            'lawyer_specialization'
        ]
