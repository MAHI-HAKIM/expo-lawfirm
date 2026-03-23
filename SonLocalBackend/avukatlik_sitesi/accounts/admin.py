from django.contrib import admin
from .models import CustomUser,Lawyer, Client


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'role', 'is_staff')
    search_fields = ('email', 'full_name')
    list_filter = ('role', 'is_active')
    

# ? Burada bu model'i nedne kayıt ettik tam oalrak anlamadım onu araştırmam gerek.
admin.site.register(Lawyer)
admin.site.register(Client)