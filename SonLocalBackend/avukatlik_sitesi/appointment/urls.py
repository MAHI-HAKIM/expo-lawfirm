from django.urls import path
from .views import (AppointmentCreateView,
                    AvailableTimeView,
                    UnavailableTimeCreateView,
                    UnavailableTimeListView,
                    AppointmentListView,
                    CancelAppointmentView,
                    UnavailableTimeDeleteView,
                    AdminAppointmentListView,
                    LawyerAppointmentStatusUpdateView,
                    AdminCreateUnavailableTimeView,
                    UnavailableTimesByLawyerView,
                    DeleteUnavailableTimeView)
urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('available-times/', AvailableTimeView.as_view(), name='available-times'),
    # ! asagidakiler test edimedi.
    path('unavailable/create/', UnavailableTimeCreateView.as_view(), name='unavailable-create'),
    path('unavailable/list/', UnavailableTimeListView.as_view(), name='unavailable-list'),
    path('unavailable/delete/<int:pk>/', UnavailableTimeDeleteView.as_view(), name='unavailable-delete'),

    path('admin/create-unavailable/', AdminCreateUnavailableTimeView.as_view(), name='admin-create-unavailable'),
    path('admin/unavailable/<int:lawyer_id>/', UnavailableTimesByLawyerView.as_view(), name='lawyer-unavailable-list'),
    path('admin/unavailable/delete/<int:pk>/', DeleteUnavailableTimeView.as_view(), name='unavailable-delete'),

    
    path('my-appointments/', AppointmentListView.as_view(), name='appointment-list'),
    path('cancel/<int:pk>/', CancelAppointmentView.as_view(), name='appointment-cancel'),
    path('lawyer/appointment-status/<int:pk>/', LawyerAppointmentStatusUpdateView.as_view(), name='lawyer-appointment-status'),
    path('all-appointments/', AdminAppointmentListView.as_view(), name='admin-appointments'),
]
