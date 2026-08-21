from reports.patterns.strategy.strategies import (
    StrictMatchStrategy,
    FlexibleMatchStrategy,
)


class MatchStrategyRegistry:

    _strategies = {
        "strict": StrictMatchStrategy,
        "flexible": FlexibleMatchStrategy,
    }

    @classmethod
    def get_strategy(cls, strategy_type):
        try:
            return cls._strategies[strategy_type]
        except KeyError:
            raise ValueError("Invalid matching strategy")