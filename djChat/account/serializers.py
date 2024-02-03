from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)

from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username",)


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)

        if valid:
            username = self.validated_data["username"]
            if Account.objects.filter(username=username).exists():
                self._errors["username"] = ["username already exists"]
                valid = False

        return valid

    def create(self, validated_data):
        user = Account.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_id"] = self.user.id
        return data


class JWTCookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get(
            settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"]
        )

        if attrs["refresh"]:
            return super().validate(attrs)

        else:
            raise InvalidToken("Invalid Refresh Token Found")
