from abc import ABC, abstractmethod

from notifications.models import Notification


class ClaimObserver(ABC):

    @abstractmethod
    def notify(self, claim):
        pass


class ClaimNotificationObserver(ClaimObserver):

    def notify(self, claim):
        Notification.objects.create(
            user=claim.claimant,
            message=(
                f"Your claim for '{claim.item.title}' "
                f"has been {claim.status.lower()}."
            ),
        )