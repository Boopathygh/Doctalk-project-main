from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterUserView, UserProfileView, SymptomCheckView, ReportUploadView, DoctorListView, AppointmentView, ChatbotView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('symptom-check/', SymptomCheckView.as_view(), name='symptom_check'),
    path('report-analyze/', ReportUploadView.as_view(), name='report_analyze'),
    path('doctors/', DoctorListView.as_view(), name='doctor_list'),
    path('appointments/book/', AppointmentView.as_view(), name='book_appointment'),
    path('chat/', ChatbotView.as_view(), name='chat'),
]
