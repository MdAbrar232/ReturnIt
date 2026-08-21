from django.test import TestCase

from claims.models import Claim
from claims.patterns.observer.observers import ClaimNotificationObserver
from claims.patterns.observer.subject import ClaimSubject
from notifications.models import Notification
from reports.models import Category, Item, Location, Report
from users.models import User


class ClaimObserverTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="claim_observer_test",
            university_id="CLAIMOBS001",
            password="testpassword",
        )

        self.location = Location.objects.create(
            name="Claim Observer Location",
            description="Location for claim observer tests",
        )

        self.category = Category.objects.create(
            name="Claim Electronics",
        )

        self.report = Report.objects.create(
            type=Report.ReportType.FOUND,
            description="Found phone",
            report_date="2026-08-13",
            location=self.location,
            user=self.user,
        )

        self.item = Item.objects.create(
            title="Black Samsung Phone",
            description="Black Samsung smartphone",
            brand="Samsung",
            color="Black",
            condition="GOOD",
            category=self.category,
            report=self.report,
        )

    def create_claim(self):
        return Claim.objects.create(
            claimant=self.user,
            item=self.item,
            proof="Original purchase receipt",
            remarks="Claim observer test",
            status=Claim.Status.PENDING,
        )

    def test_claim_notification_observer(self):
        claim = self.create_claim()

        subject = ClaimSubject()
        observer = ClaimNotificationObserver()

        subject.register_observer(observer)
        subject.notify_observers(claim)

        notification = Notification.objects.get(
            user=self.user
        )

        self.assertEqual(
            notification.message,
            "Your claim for 'Black Samsung Phone' "
            "has been pending.",
        )

    def test_approved_claim_creates_notification(self):
        claim = self.create_claim()

        claim.approve()

        subject = ClaimSubject()
        subject.register_observer(
            ClaimNotificationObserver()
        )
        subject.notify_observers(claim)

        notification = Notification.objects.get(
            user=self.user
        )

        self.assertEqual(
            notification.message,
            "Your claim for 'Black Samsung Phone' "
            "has been approved.",
        )

        self.assertFalse(notification.is_read)

    def test_rejected_claim_creates_notification(self):
        claim = self.create_claim()

        claim.reject()

        subject = ClaimSubject()
        subject.register_observer(
            ClaimNotificationObserver()
        )
        subject.notify_observers(claim)

        notification = Notification.objects.get(
            user=self.user
        )

        self.assertEqual(
            notification.message,
            "Your claim for 'Black Samsung Phone' "
            "has been rejected.",
        )

        self.assertFalse(notification.is_read)

    def test_cancelled_claim_creates_notification(self):
        claim = self.create_claim()

        claim.cancel()

        subject = ClaimSubject()
        subject.register_observer(
            ClaimNotificationObserver()
        )
        subject.notify_observers(claim)

        notification = Notification.objects.get(
            user=self.user
        )

        self.assertEqual(
            notification.message,
            "Your claim for 'Black Samsung Phone' "
            "has been cancelled.",
        )

        self.assertFalse(notification.is_read)