from django.urls import path
from accounts.views.users_views import (MeView,ProfileUpdateView,SetUserRoleView,DeleteUserView,LawyerListView,
                                        UserListView,
                                        ChangePasswordView,
                                        UserDetailView,
                                        DeleteLawyerView,
                                        LawyerDetailView)


urlpatterns = [ 
    path("me/", MeView.as_view(), name="me"),
    path("profile/update/", ProfileUpdateView.as_view(), name="profile-update"),
    path('<int:pk>/set-role/', SetUserRoleView.as_view(), name='user-set-role'),
    path('<int:pk>/delete/', DeleteUserView.as_view(), name='user-delete'),
    path('list-all/', UserListView.as_view(), name='lawyer-list'),
    path('list-lawyers/', LawyerListView.as_view(), name='lawyer-list'),

    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user-detail/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('lawyer/<int:pk>/delete/', DeleteLawyerView.as_view(), name='lawyer-delete'),
    path('lawyer-detail/<int:pk>/', LawyerDetailView.as_view(), name='lawyer-detail'),
]