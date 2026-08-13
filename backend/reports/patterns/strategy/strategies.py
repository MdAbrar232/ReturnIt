from abc import ABC, abstractmethod


class MatchStrategy(ABC):     #StrategyInterface

    @abstractmethod
    def execute(self, lost_item, found_items):
        pass

class BasicMatchStrategy(MatchStrategy):   #ConcreteStrategy

    def execute(self, lost_item, found_items):
        matches = []

        for found_item in found_items:
            score = 0

            if lost_item.category == found_item.category:
                score += 1

            if lost_item.brand == found_item.brand:
                score += 1

            if lost_item.color == found_item.color:
                score += 1

            if lost_item.condition == found_item.condition:
                score += 1

            matches.append({
                "item": found_item,
                "score": score,
            })

        return matches


class WeightedMatchStrategy(MatchStrategy):   #ConcreteStrategy

    def execute(self, lost_item, found_items):
        matches = []

        for found_item in found_items:
            score = 0

            if lost_item.brand == found_item.brand:
                score += 30

            if lost_item.color == found_item.color:
                score += 30

            if lost_item.category == found_item.category:
                score += 25

            if lost_item.condition == found_item.condition:
                score += 15

            matches.append({
                "item": found_item,
                "score": score,
            })

        return matches