from django.test import TestCase
from reports.services.matching_service import MatchingService
from reports.models import Category, Item, Location, Report
from reports.patterns.strategy.context import MatchContext
from reports.patterns.strategy.strategies import (
    BasicMatchStrategy,
    WeightedMatchStrategy,
)
from users.models import User


class MatchStrategyTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="strategytest",
            university_id="STRATEGY001",
            password="testpassword",
        )

        self.location = Location.objects.create(
            name="Strategy Test Location",
            description="Location used for Strategy tests",
        )

        self.category = Category.objects.create(
            name="Electronics"
        )

        self.lost_report = Report.objects.create(
            type=Report.ReportType.LOST,
            description="Lost phone",
            report_date="2026-08-13",
            location=self.location,
            user=self.user,
        )

        self.found_report = Report.objects.create(
            type=Report.ReportType.FOUND,
            description="Found phone",
            report_date="2026-08-13",
            location=self.location,
            user=self.user,
        )

        self.lost_item = Item.objects.create(
            title="Black Samsung Phone",
            description="Black Samsung smartphone",
            brand="Samsung",
            color="Black",
            condition="GOOD",
            category=self.category,
            report=self.lost_report,
        )

        self.found_item = Item.objects.create(
            title="Black Samsung Phone",
            description="Black Samsung smartphone",
            brand="Samsung",
            color="Black",
            condition="GOOD",
            category=self.category,
            report=self.found_report,
        )

    def test_strategy_can_be_changed_at_runtime(self):
        context = MatchContext(
            BasicMatchStrategy()
        )

        basic_results = context.match(
            self.lost_item,
            [self.found_item],
        )

        context.set_strategy(
            WeightedMatchStrategy()
        )

        weighted_results = context.match(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(
            basic_results[0]["score"],
            4,
        )

        self.assertEqual(
            weighted_results[0]["score"],
            100,
        )

    def test_matching_service_uses_weighted_strategy(self):
        results = MatchingService.find_matches(
            self.lost_item,
            strategy_type="weighted",
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["item"], self.found_item)
        self.assertEqual(results[0]["score"], 100)

    def test_matching_service_uses_basic_strategy(self):
        results = MatchingService.find_matches(
            self.lost_item,
            strategy_type="basic",
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["item"], self.found_item)
        self.assertEqual(results[0]["score"], 4)

    def test_matching_service_finds_lost_items_for_found_item(self):
        results = MatchingService.find_matches_for_found(
            self.found_item,
            strategy_type="weighted",
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["item"], self.lost_item)
        self.assertEqual(results[0]["score"], 100)