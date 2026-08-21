from reports.models import Category, Item, Photo
from notifications.patterns.observer.subject import report_subject
from reports.patterns.factory.registry import ReportFactoryRegistry


# Initializing the Factory Pattern for creating lost and found reports
class ReportService:

    @staticmethod
    def create_report(user, report_type, data):
        creator_class = ReportFactoryRegistry.get_creator(
            report_type
        )

        creator = creator_class()

        item_data = data.pop("item")

        report = creator.create_report(user, data)

        category = Category.objects.get(
            id=item_data["category"]
        )

        item = Item.objects.create(
            report=report,
            title=item_data["title"],
            description=item_data["description"],
            brand=item_data["brand"],
            color=item_data["color"],
            condition=item_data["condition"],
            category=category,
        )

        image = item_data.get("image")

        if image:
            Photo.objects.create(
                item=item,
                image=image,
            )

        report_subject.notify_observers(report)

        return report