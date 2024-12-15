from django.db import models
from django.contrib.auth.models import AbstractUser


class Account(AbstractUser):
    patronymic = models.CharField(verbose_name="Отчество",
                                  null=True,
                                  blank=True,
                                  max_length=50)
    company = models.CharField(verbose_name="Компания",
                                  null=True,
                                  blank=True,
                                  max_length=200)
    INN = models.IntegerField(verbose_name="ИНН",
                              null=True,
                              blank=True)