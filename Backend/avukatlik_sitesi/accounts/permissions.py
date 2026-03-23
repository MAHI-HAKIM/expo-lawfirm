from rest_framework.permissions import BasePermission

# * Artık her API endpoint'inde permission_classes = [IsLawyer] gibi kullanarak 
# * role özel erişim kısıtlaması getirebiliriz.

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsLawyer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "lawyer"

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'
