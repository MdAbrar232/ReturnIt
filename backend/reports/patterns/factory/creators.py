from abc import ABC, abstractmethod

from reports.patterns.factory.products import ReportProduct


class ReportCreator(ABC): #CreatorInterface

    @abstractmethod
    def create_product(self) -> ReportProduct:
        pass

    def create_report(self, user, data):
        product = self.create_product()
        return product.create_report(user, data)

class LostReportCreator(ReportCreator): #ConcreteCreator

    def create_product(self) -> ReportProduct:
        from reports.patterns.factory.products import LostReport

        return LostReport()


class FoundReportCreator(ReportCreator): #ConcreteCreator

    def create_product(self) -> ReportProduct:
        from reports.patterns.factory.products import FoundReport

        return FoundReport()