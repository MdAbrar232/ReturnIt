from claims.patterns.observer.observers import (
    ClaimNotificationObserver,
)


class ClaimSubject:

    def __init__(self):
        self.observers = []

    def register_observer(self, observer):
        self.observers.append(observer)

    def unregister_observer(self, observer):
        self.observers.remove(observer)

    def notify_observers(self, claim):
        for observer in self.observers:
            observer.notify(claim)


claim_subject = ClaimSubject()

claim_subject.register_observer(
    ClaimNotificationObserver()
)