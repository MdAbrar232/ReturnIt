from users.models import User
from reports.services.report_service import ReportService
from unittest.mock import patch
from datetime import date
from reports.patterns.factory.registry import ReportFactoryRegistry
from django.test import TestCase

from reports.models import Location, Report, Category 
from reports.patterns.factory.creators import (
    FoundReportCreator,
    LostReportCreator,
)
from reports.patterns.facade.facade import ReportFacade


class ReportFactoryTest(TestCase):

    def setUp(self):
        self.location = Location.objects.create(
            name="Main Library",
            description="University main library",
        )
        self.user = User.objects.create_user(
            username="testuser",
            university_id="TEST001",
            password="testpassword",
        )
        self.category = Category.objects.create(
            name="Electronics"
        )

    def test_lost_report_creator(self):
        creator = LostReportCreator()

        data = {
            "description": "Black Samsung phone",
            "report_date": date.today(),
            "location": self.location,
        }

        report = creator.create_report(self.user, data)

        self.assertEqual(report.type, Report.ReportType.LOST)

    def test_found_report_creator(self):
        creator = FoundReportCreator()

        data = {
            "description": "Black Samsung phone",
            "report_date": date.today(),
            "location": self.location,
        }

        report = creator.create_report(self.user, data)

        self.assertEqual(report.type, Report.ReportType.FOUND)

    def test_report_service_creates_lost_report(self):
        data = {
            "description": "Black Samsung phone",
            "report_date": date.today(),
            "location": self.location,
            "item": {
                "title": "Black Samsung Phone",
                "description": "Black Samsung smartphone",
                "brand": "Samsung",
                "color": "Black",
                "condition": "GOOD",
                "category": self.category.id,
            },
        }

        report = ReportService.create_report(
            self.user,
            "LOST",
            data,
        )

        self.assertEqual(report.type, Report.ReportType.LOST)

    def test_report_service_creates_found_report(self):
        data = {
            "description": "Black Samsung phone",
            "report_date": date.today(),
            "location": self.location,
            "item": {
                "title": "Black Samsung Phone",
                "description": "Black Samsung smartphone",
                "brand": "Samsung",
                "color": "Black",
                "condition": "GOOD",
                "category": self.category.id,
            },
        }

        report = ReportService.create_report(
            self.user,
            "FOUND",
            data,
        )

        self.assertEqual(report.type, Report.ReportType.FOUND)

    @patch("reports.services.report_service.report_subject")
    def test_report_service_notifies_observers(
        self,
        mock_subject,
    ):
        data = {
            "description": "Black Samsung phone",
            "report_date": date.today(),
            "location": self.location,
            "item": {
                "title": "Black Samsung Phone",
                "description": "Black Samsung smartphone",
                "brand": "Samsung",
                "color": "Black",
                "condition": "GOOD",
                "category": self.category.id,
            },
        }

        report = ReportService.create_report(
            self.user,
            "FOUND",
            data,
        )

        mock_subject.notify_observers.assert_called_once_with(
            report
        )
    def test_facade_submits_report(self):
        facade = ReportFacade()

        data = {
            "description": "Found black wallet",
            "report_date": date.today(),
            "location": self.location,
            "item": {
                "title": "Black Wallet",
                "description": "Black leather wallet",
                "brand": "Unknown",
                "color": "Black",
                "condition": "GOOD",
                "category": self.category.id,
            },
        }

        report = facade.submit_report(
            self.user,
            "FOUND",
            data,
        )

        self.assertEqual(report.type, Report.ReportType.FOUND)
    def test_registry_returns_lost_creator(self):
        creator_class = ReportFactoryRegistry.get_creator("LOST")

        self.assertEqual(
            creator_class,
            LostReportCreator,
        )


    def test_registry_returns_found_creator(self):
        creator_class = ReportFactoryRegistry.get_creator("FOUND")

        self.assertEqual(
            creator_class,
            FoundReportCreator,
        )


    def test_registry_rejects_invalid_report_type(self):
        with self.assertRaises(ValueError):
            ReportFactoryRegistry.get_creator("INVALID")

       