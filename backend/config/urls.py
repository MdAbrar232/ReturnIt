from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/reports/", include("reports.urls")),
    path("api/claims/", include("claims.urls")),
    path("api/auth/", include("users.urls")),
    path(
        "api/notifications/",
        include("notifications.urls"),
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )