from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from reports.models import Location
from reports.serializers import ReportCreateSerializer
from reports.services.report_service import ReportService

from reports.models import Report
from reports.services.matching_service import MatchingService

class ReportCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        reports = Report.objects.filter(
            user=request.user
        ).order_by("-report_date", "-id")

        return Response(
            [
                {
                    "id": report.id,
                    "type": report.type,
                    "description": report.description,
                    "report_date": report.report_date,
                    "location": report.location.name,
                    "item": {
                        "title": report.item.title,
                        "description": report.item.description,
                        "brand": report.item.brand,
                        "color": report.item.color,
                        "condition": report.item.condition,
                        "category": report.item.category.name,
                    },
                }
                for report in reports
            ],
            status=status.HTTP_200_OK,
        )
    
    def post(self, request):
        serializer = ReportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        try:
            location = Location.objects.get(
                id=data["location"]
            )
        except Location.DoesNotExist:
            return Response(
                {"error": "Location not found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        report = ReportService.create_report(
            user=request.user,
            report_type=data["type"],
            data={
                "description": data["description"],
                "report_date": data["report_date"],
                "location": location,
                "item": data["item"],
            },
        )

        return Response(
            {
                "id": report.id,
                "type": report.type,
                "description": report.description,
                "report_date": report.report_date,
                "location": report.location.name,
            },
            status=status.HTTP_201_CREATED,
        )

class ReportMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        try:
            report = Report.objects.get(
                id=report_id,
                user=request.user,
            )
        except Report.DoesNotExist:
            return Response(
                {"error": "Report not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if report.type != Report.ReportType.LOST:
            return Response(
                {
                    "error": (
                        "Matching is currently available "
                        "for lost reports only."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        lost_item = report.item

        strategy_type = request.query_params.get(
            "strategy",
            "weighted",
        )

        try:
            matches = MatchingService.find_matches(
                lost_item,
                strategy_type=strategy_type,
            )
        except ValueError as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            [
                {
                    "item_id": match["item"].id,
                    "title": match["item"].title,
                    "description": match["item"].description,
                    "brand": match["item"].brand,
                    "color": match["item"].color,
                    "condition": match["item"].condition,
                    "score": match["score"],
                }
                for match in matches
            ],
            status=status.HTTP_200_OK,
        )