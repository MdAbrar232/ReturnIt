from abc import ABC, abstractmethod

from reports.models import Report


class ReportProduct(ABC):   #ProductInterface
    @abstractmethod
    def create_report(self, user, data) -> Report:
        pass

class LostReport(ReportProduct):  #ConcreteProduct
    def create_report(self, user, data) -> Report:
        return Report.objects.create(
            user=user,
            type=Report.ReportType.LOST,
            description=data["description"],
            report_date=data["report_date"],
            location=data["location"],
        )


class FoundReport(ReportProduct): #ConcreteProduct
    def create_report(self, user, data) -> Report:
        return Report.objects.create(
            user=user,
            type=Report.ReportType.FOUND,
            description=data["description"],
            report_date=data["report_date"],
            location=data["location"],
        )