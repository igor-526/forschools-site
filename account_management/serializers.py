from rest_framework import serializers
from .models import Account


class AccountNameOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'first_name', 'last_name', 'patronymic']

