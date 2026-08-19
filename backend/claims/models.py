from django.conf import settings
from django.db import models

from reports.models import Item


class Claim(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED", "Cancelled"

    claimant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="claims",
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="claims",
    )

    proof = models.TextField()

    remarks = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return (
            f"Claim #{self.id} - "
            f"{self.claimant.username} - "
            f"{self.item.title}"
        )

    def approve(self):
        if self.status != self.Status.PENDING:
            raise ValueError(
                f"Claim cannot be approved because "
                f"its current status is {self.status}."
            )

        self.status = self.Status.APPROVED
        self.save(update_fields=["status", "updated_at"])

    def reject(self):
        if self.status != self.Status.PENDING:
            raise ValueError(
                f"Claim cannot be rejected because "
                f"its current status is {self.status}."
            )

        self.status = self.Status.REJECTED
        self.save(update_fields=["status", "updated_at"])

    def cancel(self):
        if self.status != self.Status.PENDING:
            raise ValueError(
                f"Claim cannot be cancelled because "
                f"its current status is {self.status}."
            )

        self.status = self.Status.CANCELLED
        self.save(update_fields=["status", "updated_at"])