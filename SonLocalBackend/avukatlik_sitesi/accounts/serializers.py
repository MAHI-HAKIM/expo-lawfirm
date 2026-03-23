from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from accounts.models import CustomUser as User, Client, Lawyer
from django.contrib.auth import authenticate
# Reset password için
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
import random
import string
from django.contrib.auth import password_validation

User = get_user_model()


# * JWT token'ı oluştururken kullanacağımız serializer.
# * Customize ederek içerisine role bilgisini ekledik.
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # * classmethod ile static method gibi kullanıyoruz.
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Role ekliyoruz
        # ! aslında buna gerek yokmus. django otomatik olarak user'i ekliyormus jwt'ye.
        # ! bilmeden yaptim ancak kalsin.
        token['role'] = user.role
        return token
    
    # ! normalde validate icin username kullaniliyordu.
    # ! Biz username alanini sildik ve email uzerinden dogrulama yapmak istedik.
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise serializers.ValidationError("E-posta veya şifre yanlış.")
        except User.DoesNotExist:
            raise serializers.ValidationError("E-posta veya şifre yanlış.")

        return super().validate(attrs)


#! env variable'ına Auth.user olarak bizim oluşturduğumuz User'ı verdiğimizden
#! Burada get_user_model() ile onu çağırmış oluyoruz.
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=False, default='client')

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'role']
    #! create fonksiyonun burada override ediyoruz.
    #! Bunun sebebi User'ın içerisindeki password alanının şifreli olarak db'de kaydolması için.

    def create(self, validated_data):
        role = "client"  # default: client
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone=validated_data.get('phone', '')
        )
        user.role = role
        user.save()

        # ! Register endpointi herkesi client olrak kabul eder.
        Client.objects.create(user=user)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role', 'is_staff', 'is_active']
        
        
        
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone']
        
        
        
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu e-posta ile kayıtlı kullanıcı bulunamadı.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=6)

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data["uid"]).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Geçersiz kullanıcı ID.")

        if not default_token_generator.check_token(user, data["token"]):
            raise serializers.ValidationError("Geçersiz veya süresi dolmuş token.")

        user.set_password(data["new_password"])
        user.save()
        return data

class LawyerListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')  # 👈 id buradan alınıyor
    full_name = serializers.CharField(source='user.full_name')
    email = serializers.EmailField(source='user.email')
    class Meta:
        model = Lawyer
        fields = ['id', 'full_name', 'email', 'specialization', 'bio']
        
# accounts/serializers/lawyer_serializer.py




class AdminLawyerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(read_only=True)
    specialization = serializers.CharField(write_only=True)
    bio = serializers.CharField(write_only=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone', 'specialization', 'bio', 'password']

    def create(self, validated_data):
        specialization = validated_data.pop('specialization')
        bio = validated_data.pop('bio')

        # 🔐 Otomatik şifre üret
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        validated_data['role'] = 'lawyer'
        user = User.objects.create_user(**validated_data, password=password)

        # Lawyer modeliyle ilişkilendir
        Lawyer.objects.create(user=user, specialization=specialization, bio=bio)

        # ➕ Şifreyi response için ekle
        user.generated_password = password
        return user



# accounts/serializers/change_password_serializer.py


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value


# accounts/serializers/user_detail_serializer.py


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'phone', 'role']


class LawyerDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')
    full_name = serializers.CharField(source='user.full_name')
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    role = serializers.CharField(source='user.role')

    class Meta:
        model = Lawyer
        fields = ['id', 'full_name', 'email', 'phone','role', 'specialization', 'bio']
