from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Report(models.Model):
    class ReportType(models.TextChoices):
        LOST = "LOST", "Lost"
        FOUND = "FOUND", "Found"

    class ReportStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        RESOLVED = "RESOLVED", "Resolved"
        CLOSED = "CLOSED", "Closed"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports",
    )
    type = models.CharField(
        max_length=5,
        choices=ReportType.choices,
    )
    description = models.TextField()
    report_date = models.DateField()
    location = models.ForeignKey(
        Location,
        on_delete=models.PROTECT,
        related_name="reports",
    )
    status = models.CharField(
        max_length=10,
        choices=ReportStatus.choices,
        default=ReportStatus.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_type_display()} Report #{self.id}"


class Item(models.Model):
    class Condition(models.TextChoices):
        NEW = "NEW", "New"
        GOOD = "GOOD", "Good"
        FAIR = "FAIR", "Fair"
        DAMAGED = "DAMAGED", "Damaged"

    report = models.OneToOneField(
        Report,
        on_delete=models.CASCADE,
        related_name="item",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="items",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    brand = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    condition = models.CharField(
        max_length=10,
        choices=Condition.choices,
    )

    def __str__(self):
        return self.title


class Photo(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    image = models.ImageField(upload_to="item_photos/")

    def __str__(self):
        return f"Photo for {self.item.title}"