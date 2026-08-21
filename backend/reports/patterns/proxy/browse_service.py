from reports.models import Report


class BrowseReportsService:
    """
    Real Subject.

    Performs the actual database query for browsing reports.
    """

    def get_reports(
        self,
        report_type=None,
        category=None,
        location=None,
        search=None,
    ):
        reports = (
            Report.objects
            .select_related(
                "user",
                "location",
                "item",
                "item__category",
            )
            .prefetch_related("item__photos")
            .order_by("-report_date", "-id")
        )

        if report_type in [
            Report.ReportType.LOST,
            Report.ReportType.FOUND,
        ]:
            reports = reports.filter(
                type=report_type
            )

        if category:
            reports = reports.filter(
                item__category_id=category
            )

        if location:
            reports = reports.filter(
                location_id=location
            )

        if search:
            reports = reports.filter(
                item__title__icontains=search
            )

        return reports