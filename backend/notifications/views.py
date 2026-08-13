from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification


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
            status=status.HTTP_200_OK,
        )