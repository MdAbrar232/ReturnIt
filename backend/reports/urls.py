from django.urls import path

from reports.views import ReportCreateView, ReportMatchesView


urlpatterns = [
    path("", ReportCreateView.as_view(), name="report-create"),
    path(
        "<int:report_id>/matches/",
        ReportMatchesView.as_view(),
        name="report-matches",
    ),
]