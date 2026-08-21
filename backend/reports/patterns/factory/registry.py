from reports.patterns.factory.creators import (
    FoundReportCreator,
    LostReportCreator,
)


class ReportFactoryRegistry:

    _creators = {
        "LOST": LostReportCreator,
        "FOUND": FoundReportCreator,
    }

    @classmethod
    def get_creator(cls, report_type):
        try:
            return cls._creators[report_type]
        except KeyError:
            raise ValueError("Invalid report type")