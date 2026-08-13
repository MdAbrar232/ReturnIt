from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        FACULTY = "FACULTY", "Faculty"
        STAFF = "STAFF", "Staff"
        ADMIN = "ADMIN", "Admin"

    university_id = models.CharField(max_length=20, unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
    )

    def __str__(self):
        return self.username