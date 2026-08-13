from reports.services.report_service import ReportService


class ReportFacade:

    def submit_report(self, user, report_type, data):
        return ReportService.create_report(
            user,
            report_type,
            data,
        )