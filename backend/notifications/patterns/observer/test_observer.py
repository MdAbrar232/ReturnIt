from unittest.mock import Mock

from django.test import TestCase

from users.models import User
from reports.models import Category, Item, Location, Report
from notifications.models import Notification
from notifications.patterns.observer.observers import (
    ActivityLogObserver,
    MatchObserver,
    NotificationObserver,
)
from notifications.patterns.observer.subject import ReportSubject


class ObserverTest(TestCase):

    def test_observers_receive_notification(self):
        subject = ReportSubject()

        match_observer = MatchObserver()
        notification_observer = NotificationObserver()
        activity_observer = ActivityLogObserver()

        subject.register_observer(match_observer)
        subject.register_observer(notification_observer)
        subject.register_observer(activity_observer)

        self.assertEqual(len(subject.observers), 3)

        user = User.objects.create_user(
            username="observer_test",
            university_id="OBSERVER001",
            password="testpassword",
        )

        report = Mock()
        report.user = user
        report.type = "LOST"

        subject.notify_observers(report)

        self.assertEqual(len(subject.observers), 3)

    def test_observer_can_be_unregistered(self):
        subject = ReportSubject()

        match_observer = MatchObserver()
        notification_observer = NotificationObserver()

        subject.register_observer(match_observer)
        subject.register_observer(notification_observer)

        self.assertEqual(len(subject.observers), 2)

        subject.unregister_observer(notification_observer)

        self.assertEqual(len(subject.observers), 1)
        self.assertIn(match_observer, subject.observers)
        self.assertNotIn(notification_observer, subject.observers)

    def test_notify_calls_each_registered_observer(self):
        subject = ReportSubject()

        observer_a = Mock()
        observer_b = Mock()
        report = Mock()

        subject.register_observer(observer_a)
        subject.register_observer(observer_b)

        subject.notify_observers(report)

        observer_a.notify.assert_called_once_with(report)
        observer_b.notify.assert_called_once_with(report)

    def test_notification_observer_creates_notification(self):
        user = User.objects.create_user(
            username="notification_test",
            university_id="NOTIFICATION001",
            password="testpassword",
        )

        report = Mock()
        report.user = user
        report.type = "FOUND"

        observer = NotificationObserver()

        observer.notify(report)

        notification = Notification.objects.get(
            user=user
        )

        self.assertEqual(
            notification.message,
            "Your FOUND report has been created successfully.",
        )

        self.assertFalse(notification.is_read)

    def test_match_observer_triggers_matching_for_found_report(self):
        user = User.objects.create_user(
            username="match_observer_test",
            university_id="MATCH001",
            password="testpassword",
        )

        location = Location.objects.create(
            name="Match Test Location",
            description="Location for MatchObserver test",
        )

        category = Category.objects.create(
            name="Match Electronics",
        )

        lost_report = Report.objects.create(
            type=Report.ReportType.LOST,
            description="Lost phone",
            report_date="2026-08-13",
            location=location,
            user=user,
        )

        found_report = Report.objects.create(
            type=Report.ReportType.FOUND,
            description="Found phone",
            report_date="2026-08-13",
            location=location,
            user=user,
        )

        lost_item = Item.objects.create(
            title="Black Samsung Phone",
            description="Black Samsung smartphone",
            brand="Samsung",
            color="Black",
            condition="GOOD",
            category=category,
            report=lost_report,
        )

        found_item = Item.objects.create(
            title="Black Samsung Phone",
            description="Black Samsung smartphone",
            brand="Samsung",
            color="Black",
            condition="GOOD",
            category=category,
            report=found_report,
        )

        observer = MatchObserver()

        matches = observer.notify(found_report)

        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["item"], lost_item)