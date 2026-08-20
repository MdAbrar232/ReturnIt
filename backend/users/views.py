from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from users.serializers import LoginSerializer, SignupSerializer
from users.models import User
from users.serializers import LoginSerializer



class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        university_id = serializer.validated_data["university_id"]
        password = serializer.validated_data["password"]

        try:
            user = User.objects.get(university_id=university_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid university ID or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = authenticate(
            username=user.username,
            password=password,
        )

        if user is None:
            return Response(
                {"error": "Invalid university ID or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "university_id": user.university_id,
                    "username": user.username,
                    "role": user.role,
                },
            },
            status=status.HTTP_200_OK,
        )

class SignupView(APIView):

    def post(self, request):
        serializer = SignupSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Account created successfully.",
                    "user": {
                        "id": user.id,
                        "university_id": user.university_id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()

        return Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )