from django.shortcuts import render

from api import serializer as api_serializer
from userauths.models import User, Profile

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny

# call serializer view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer
    # both authenticated or not any users can access this view
