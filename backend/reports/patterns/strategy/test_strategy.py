from django.test import TestCase
from reports.patterns.strategy.registry import MatchStrategyRegistry
from reports.models import Category, Item, Location, Report
from reports.patterns.strategy.context import MatchContext
from reports.patterns.strategy.strategies import (
    StrictMatchStrategy,
    FlexibleMatchStrategy,
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

        self.other_category = Category.objects.create(
            name="Accessories"
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

    def test_strict_strategy_finds_exact_match(self):
        strategy = StrictMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 1)
        self.assertEqual(
            results[0]["item"],
            self.found_item,
        )

    def test_strict_strategy_rejects_different_brand(self):
        self.found_item.brand = "Apple"
        self.found_item.save()

        strategy = StrictMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 0)

    def test_strict_strategy_rejects_different_color(self):
        self.found_item.color = "White"
        self.found_item.save()

        strategy = StrictMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 0)

    def test_strict_strategy_rejects_different_category(self):
        self.found_item.category = self.other_category
        self.found_item.save()

        strategy = StrictMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 0)

    def test_flexible_strategy_matches_same_brand(self):
        self.found_item.color = "White"
        self.found_item.save()

        strategy = FlexibleMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 1)

    def test_flexible_strategy_matches_same_color(self):
        self.found_item.brand = "Apple"
        self.found_item.save()

        strategy = FlexibleMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 1)

    def test_flexible_strategy_rejects_no_identifying_match(self):
        self.found_item.brand = "Apple"
        self.found_item.color = "White"
        self.found_item.save()

        strategy = FlexibleMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 0)

    def test_flexible_strategy_rejects_different_category(self):
        self.found_item.brand = "Samsung"
        self.found_item.category = self.other_category
        self.found_item.save()

        strategy = FlexibleMatchStrategy()

        results = strategy.execute(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(results), 0)

    def test_strategy_can_be_changed_at_runtime(self):
        context = MatchContext(
            StrictMatchStrategy()
        )

        self.found_item.brand = "Apple"
        self.found_item.color = "Black"
        self.found_item.save()

        strict_results = context.match(
            self.lost_item,
            [self.found_item],
        )

        context.set_strategy(
            FlexibleMatchStrategy()
        )

        flexible_results = context.match(
            self.lost_item,
            [self.found_item],
        )

        self.assertEqual(len(strict_results), 0)
        self.assertEqual(len(flexible_results), 1)
    def test_registry_returns_strict_strategy(self):
        strategy_class = MatchStrategyRegistry.get_strategy("strict")

        self.assertEqual(
            strategy_class,
            StrictMatchStrategy,
        )


    def test_registry_returns_flexible_strategy(self):
        strategy_class = MatchStrategyRegistry.get_strategy("flexible")

        self.assertEqual(
            strategy_class,
            FlexibleMatchStrategy,
        )


    def test_registry_rejects_invalid_strategy(self):
        with self.assertRaises(ValueError):
            MatchStrategyRegistry.get_strategy("invalid")