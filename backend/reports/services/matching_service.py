from reports.models import Item
from reports.patterns.strategy.context import MatchContext
from reports.patterns.strategy.strategies import (
    BasicMatchStrategy,
    WeightedMatchStrategy,
)

#Initializing the Strategy Pattern for matching lost and found items
class MatchingService:

    @staticmethod
    def find_matches(lost_item, strategy_type="weighted"):
        found_items = Item.objects.filter(
            report__type="FOUND"
        )

        if strategy_type == "basic":
            strategy = BasicMatchStrategy()
        elif strategy_type == "weighted":
            strategy = WeightedMatchStrategy()
        else:
            raise ValueError("Invalid matching strategy")

        context = MatchContext(strategy)

        return context.match(
            lost_item,
            found_items,
        )

    @staticmethod
    def find_matches_for_found(found_item, strategy_type="weighted"):
        lost_items = Item.objects.filter(
            report__type="LOST"
        )

        if strategy_type == "basic":
            strategy = BasicMatchStrategy()
        elif strategy_type == "weighted":
            strategy = WeightedMatchStrategy()
        else:
            raise ValueError("Invalid matching strategy")

        context = MatchContext(strategy)

        return context.match(
            found_item,
            lost_items,
        )