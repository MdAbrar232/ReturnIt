from abc import ABC, abstractmethod
from reports.services.matching_service import MatchingService
from notifications.models import Notification


class ReportObserver(ABC):  #ObserverInterface

    @abstractmethod
    def notify(self, report):
        pass


class MatchObserver(ReportObserver):  #ConcreteObserver

    def notify(self, report):
        if report.type == "FOUND":
            return MatchingService.find_matches_for_found(
                report.item
            )

        if report.type == "LOST":
            return MatchingService.find_matches(
                report.item
            )

        return []

class NotificationObserver(ReportObserver): #ConcreteObserver

    def notify(self, report):
        Notification.objects.create(
            user=report.user,
            message=f"Your {report.type} report has been created successfully.",
        )


class ActivityLogObserver(ReportObserver): #ConcreteObserver

    def notify(self, report):
        print("ActivityLogObserver: recording report activity.")