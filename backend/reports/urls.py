from django.urls import path

from reports.views import (
    BrowseReportsView,
    ReportCreateView,
    ReportMatchesView,
    ReportDetailView
)


urlpatterns = [
    path("", ReportCreateView.as_view(), name="report-create"),
    path(
        "<int:report_id>/matches/",
        ReportMatchesView.as_view(),
        name="report-matches",
    ),
    path(
    "browse/",
    BrowseReportsView.as_view(),
    name="report-browse",
),
path(
    "<int:report_id>/",
    ReportDetailView.as_view(),
    name="report-detail",
),
]