from rest_framework import serializers
from .models import Case,CaseFile
from accounts.models import Lawyer, Client
from appointment.models import Appointment
from django.contrib.auth import get_user_model

User = get_user_model() 

class CaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['title', 'description', 'appointment']

    def validate_appointment(self, appointment):
        if appointment.case is not None:
            raise serializers.ValidationError("Bu randevu için zaten bir case oluşturulmuş.")
        return appointment

    def create(self, validated_data):
        appointment = validated_data['appointment']
        validated_data['lawyer'] = appointment.lawyer  # Lawyer instance
        validated_data['client'] = appointment.client  # Client instance
        return super().create(validated_data)
        
class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Bu sınıfı kullanırken model belirtmiyoruz
        fields = ['id','email', 'full_name']  # Kullanıcı bilgileri için gerekli alanlar


class SimpleLawyerInfoSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    class Meta:
        model = Lawyer
        fields = ['user']

class SimpleClientInfoSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    class Meta:
        model = Client
        fields = ['user']

class CaseSerializer(serializers.ModelSerializer):
    lawyer = SimpleLawyerInfoSerializer()
    client = SimpleClientInfoSerializer()
    class Meta:
        model = Case
        fields = '__all__'

class SimpleCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'
        
class AppointmentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date', 'time']
        
class LawyerInfoSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    class Meta:
        model = Lawyer
        fields = ['specialization', 'bio', 'user']

class ClientInfoSerializer(serializers.ModelSerializer):
    user = UserInfoSerializer()
    class Meta:
        model = Client
        fields = [ 'user']

class CaseDetailSerializer(serializers.ModelSerializer):
    lawyer = LawyerInfoSerializer()
    client = ClientInfoSerializer()
    appointment = AppointmentInfoSerializer()

    class Meta:
        model = Case
        fields = ['id', 'title', 'description', 'appointment', 'lawyer', 'client']

class CaseFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseFile
        fields = ['id', 'case', 'file', 'uploaded_by', 'description',]
        read_only_fields = ['id', 'uploaded_by']