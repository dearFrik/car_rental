from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import RegisterView, ProfileView, CustomAuthToken, ChangePasswordView

urlpatterns = [
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
    path('profile/', csrf_exempt(ProfileView.as_view()), name='profile'),
    path('login/', csrf_exempt(CustomAuthToken.as_view()), name='login'),
    path('change-password/', csrf_exempt(ChangePasswordView.as_view()), name='change-password'),
]