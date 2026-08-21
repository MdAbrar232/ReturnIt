from pathlib import Path

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification
from claims.permissions import IsAdminUser


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(
            user=request.user
        ).order_by("-created_at")

        return Response(
            [
                {
                    "id": notification.id,
                    "message": notification.message,
                    "is_read": notification.is_read,
                    "created_at": notification.created_at,
                }
                for notification in notifications
            ],
            status=200,
        )


class AdminActivityLogsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        log_file = (
            Path(__file__).resolve().parents[1]
            / "logs"
            / "returnit.log"
        )

        if not log_file.exists():
            return Response(
                [],
                status=200,
            )

        with open(
            log_file,
            "r",
            encoding="utf-8",
        ) as file:
            logs = [
                line.strip()
                for line in file
                if line.strip()
            ]

        return Response(
            logs,
            status=200,
        )