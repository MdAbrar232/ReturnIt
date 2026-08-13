from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

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