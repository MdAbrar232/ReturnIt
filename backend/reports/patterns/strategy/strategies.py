from abc import ABC, abstractmethod


class MatchStrategy(ABC):  # StrategyInterface

    @abstractmethod
    def execute(self, lost_item, found_items):
        pass


class StrictMatchStrategy(MatchStrategy):  # ConcreteStrategy

    def execute(self, lost_item, found_items):
        matches = []

        for found_item in found_items:
            if (
                lost_item.category == found_item.category
                and lost_item.brand == found_item.brand
                and lost_item.color == found_item.color
                and lost_item.condition == found_item.condition
            ):
                matches.append({
                    "item": found_item,
                })

        return matches


class FlexibleMatchStrategy(MatchStrategy):  # ConcreteStrategy

    def execute(self, lost_item, found_items):
        matches = []

        for found_item in found_items:
            category_matches = (
                lost_item.category == found_item.category
            )

            brand_matches = (
                lost_item.brand == found_item.brand
            )

            color_matches = (
                lost_item.color == found_item.color
            )

            if category_matches and (
                brand_matches or color_matches
            ):
                matches.append({
                    "item": found_item,
                })

        return matches