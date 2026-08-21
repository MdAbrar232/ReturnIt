from reports.models import Item
from reports.patterns.strategy.context import MatchContext
from reports.patterns.strategy.registry import MatchStrategyRegistry


class MatchingService:

    @staticmethod
    def find_matches(lost_item, strategy_type="strict"):
        found_items = Item.objects.filter(
            report__type="FOUND"
        )

        strategy_class = MatchStrategyRegistry.get_strategy(
            strategy_type
        )

        context = MatchContext(strategy_class())

        return context.match(
            lost_item,
            found_items,
        )

    @staticmethod
    def find_matches_for_found(found_item, strategy_type="strict"):
        lost_items = Item.objects.filter(
            report__type="LOST"
        )

        strategy_class = MatchStrategyRegistry.get_strategy(
            strategy_type
        )

        context = MatchContext(strategy_class())

        return context.match(
            found_item,
            lost_items,
        )