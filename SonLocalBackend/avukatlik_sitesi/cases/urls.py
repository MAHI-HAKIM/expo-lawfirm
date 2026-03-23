from django.urls import path,include
from .views import (
CaseCreateView,
CaseFileUploadView,
CaseListView,
CaseDetailListView,
CaseFileListView,
CaseFileDownloadView
)

urlpatterns = [    
    path("create/", CaseCreateView.as_view(), name="case-create"),
    path('case-files/upload/', CaseFileUploadView.as_view(), name='casefile-upload'),
    path('list/', CaseListView.as_view(), name='case-list'),
    path('list-detail/', CaseDetailListView.as_view(), name='case-list-detail'),
    path('<int:case_id>/files/', CaseFileListView.as_view(), name='case-file-list'),
    path('files/<int:pk>/download/', CaseFileDownloadView.as_view(), name='case-file-download'),
]
