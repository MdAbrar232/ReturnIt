from rest_framework import serializers

from users.models import User


class LoginSerializer(serializers.Serializer):
    university_id = serializers.CharField()
    password = serializers.CharField(write_only=True)


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    password_confirm = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User
        fields = (
            "username",
            "university_id",
            "email",
            "password",
            "password_confirm",
        )

    def validate_email(self, value):
        value = value.strip().lower()

        if not value.endswith("@northsouth.edu"):
            raise serializers.ValidationError(
                "Please use a North South University email address."
            )

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        attrs.pop("password_confirm")

        return attrs

    def create(self, validated_data):
        validated_data["role"] = User.Role.STUDENT

        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )

        return user