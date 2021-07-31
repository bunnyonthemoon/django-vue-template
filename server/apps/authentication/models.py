from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.authentication.managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    paid = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

    def __str__(self):
        return self.email
