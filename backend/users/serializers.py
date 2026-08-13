from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    university_id = serializers.CharField()
    password = serializers.CharField(write_only=True)