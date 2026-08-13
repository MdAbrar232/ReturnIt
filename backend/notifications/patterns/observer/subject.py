from notifications.patterns.observer.observers import (
    ActivityLogObserver,
    MatchObserver,
    NotificationObserver,
)


class ReportSubject:   #Subject

    def __init__(self):
        self.observers = []

    def register_observer(self, observer):
        self.observers.append(observer)

    def unregister_observer(self, observer):
        self.observers.remove(observer)

    def notify_observers(self, report):
        for observer in self.observers:
            observer.notify(report)


report_subject = ReportSubject()

report_subject.register_observer(MatchObserver())
report_subject.register_observer(NotificationObserver())
report_subject.register_observer(ActivityLogObserver())