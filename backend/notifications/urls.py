from django.urls import path

from notifications.views import (
    NotificationListView,
    AdminActivityLogsView,
)


urlpatterns = [
    path(
        "",
        NotificationListView.as_view(),
        name="notification-list",
    ),
    path(
        "admin/logs/",
        AdminActivityLogsView.as_view(),
        name="admin-activity-logs",
    ),
]