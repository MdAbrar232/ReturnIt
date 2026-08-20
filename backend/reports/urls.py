from django.urls import path

from reports.views import (
    BrowseReportsView,
    CategoryListView,
    LocationListView,
    ReportCreateView,
    ReportDetailView,
    ReportManageView,
    ReportMatchesView,
    AdminReportListView,
    AdminReportStatusView,
    AdminReportDeleteView,
)


urlpatterns = [
    path(
        "",
        ReportCreateView.as_view(),
        name="report-create",
    ),

    path(
        "browse/",
        BrowseReportsView.as_view(),
        name="report-browse",
    ),

    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),

    path(
        "locations/",
        LocationListView.as_view(),
        name="location-list",
    ),

    path(
        "<int:report_id>/matches/",
        ReportMatchesView.as_view(),
        name="report-matches",
    ),

    path(
        "<int:report_id>/",
        ReportDetailView.as_view(),
        name="report-detail",
    ),
    path(
        "<int:report_id>/manage/",
        ReportManageView.as_view(),
        name="report-manage",
    ),
    path(
    "admin/",
    AdminReportListView.as_view(),
    name="admin-report-list",
),

    path(
        "admin/<int:report_id>/status/",
        AdminReportStatusView.as_view(),
        name="admin-report-status",
    ),

    path(   
        "admin/<int:report_id>/",
        AdminReportDeleteView.as_view(),
        name="admin-report-delete",
    ),
]