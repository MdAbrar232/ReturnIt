from reports.models import Category, Item
from notifications.patterns.observer.subject import report_subject
from reports.patterns.factory.creators import (
    FoundReportCreator,
    LostReportCreator,
)

#Initializing the Factory Pattern for creating lost and found reports
class ReportService:

    @staticmethod
    def create_report(user, report_type, data):
        if report_type == "LOST":
            creator = LostReportCreator()
        elif report_type == "FOUND":
            creator = FoundReportCreator()
        else:
            raise ValueError("Invalid report type")

        item_data = data.pop("item")

        report = creator.create_report(user, data)

        category = Category.objects.get(
            id=item_data["category"]
        )

        Item.objects.create(
            report=report,
            title=item_data["title"],
            description=item_data["description"],
            brand=item_data["brand"],
            color=item_data["color"],
            condition=item_data["condition"],
            category=category,
        )

        report_subject.notify_observers(report)
        
        return report