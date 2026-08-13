class MatchContext:

    def __init__(self, strategy):
        self.strategy = strategy

    def set_strategy(self, strategy):
        self.strategy = strategy

    def match(self, lost_item, found_items):
        return self.strategy.execute(
            lost_item,
            found_items,
        )