import uuid

from django.contrib.auth import authenticate, hashers, login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, scripts, serializers
from .permissions import forbidden_response


@api_view(['GET'])
@ensure_csrf_cookie
def get_user(request):
    if request.user.is_authenticated:
        user = serializers.UserSerializer(request.user).data
        return Response({"user": user})
    else:
        return Response({"user": None})


class LoginView(APIView):
    def post(self, request):
        email, password = request.data['email'], request.data['password']

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response(
                {"error": {"code": 1, "text": "Неверный логин или пароль"}}
            )

        login(request, user)

        user = serializers.UserSerializer(request.user).data
        return Response({"user": user})


class SignupView(APIView):
    def post(self, request):
        email, password = request.data['email'], request.data['password']

        user = models.User.objects.create_user(email=email, password=password)
        login(request, user)

        user = serializers.UserSerializer(request.user).data
        return Response({"user": user})


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(True)


class ChangeAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        email = request.data["email"]
        password = request.data["password"]

        try:
            request.user.email = email
            request.user.set_password(password)
            request.user.save()
        except Exception:
            return Response({"error": {"code": 1, "text": "Произошла ошибка"}})

        login(request, request.user)
        user = serializers.UserSerializer(request.user).data

        return Response({'user': user})
