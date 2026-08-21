from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from notifications.patterns.singleton.logger import Logger

from reports.patterns.proxy.caching_proxy import (
    CachingBrowseReportsProxy,
)
from reports.models import Category, Location, Report
from reports.serializers import ReportCreateSerializer
from reports.services.report_service import ReportService
from reports.services.matching_service import MatchingService

from claims.permissions import IsAdminUser


def get_item_photos(item, request):
    return [
        {
            "id": photo.id,
            "image": request.build_absolute_uri(
                photo.image.url
            ),
        }
        for photo in item.photos.all()
    ]


class ReportCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        reports = (
            Report.objects
            .filter(user=request.user)
            .select_related(
                "location",
                "item",
                "item__category",
            )
            .prefetch_related("item__photos")
            .order_by("-report_date", "-id")
        )

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
                        "photos": get_item_photos(
                            report.item,
                            request,
                        ),
                    },
                }
                for report in reports
            ],
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        data = request.data

        item_data = {
            "title": data.get("item_title"),
            "description": data.get("item_description"),
            "brand": data.get("item_brand", ""),
            "color": data.get("item_color", ""),
            "condition": data.get("item_condition"),
            "category": data.get("item_category"),
        }

        image = request.FILES.get("image")

        if image:
            item_data["image"] = image

        report_data = {
            "type": data.get("type"),
            "description": data.get("description"),
            "report_date": data.get("report_date"),
            "location": data.get("location"),
            "item": item_data,
        }

        serializer = ReportCreateSerializer(
            data=report_data
        )
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

        CachingBrowseReportsProxy.clear_cache()

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


class BrowseReportsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        proxy = CachingBrowseReportsProxy()

        report_type = request.query_params.get("type")
        category = request.query_params.get("category")
        location = request.query_params.get("location")
        search = request.query_params.get("search")

        reports = proxy.get_reports(
            report_type=report_type,
            category=category,
            location=location,
            search=search,
        )

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
                        "photos": get_item_photos(
                            report.item,
                            request,
                        ),
                    },
                }
                for report in reports
            ],
            status=status.HTTP_200_OK,
        )


class ReportDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, report_id):
        try:
            report = (
                Report.objects
                .select_related(
                    "user",
                    "location",
                    "item",
                    "item__category",
                )
                .prefetch_related("item__photos")
                .get(id=report_id)
            )
        except Report.DoesNotExist:
            return Response(
                {"error": "Report not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "id": report.id,
                "type": report.type,
                "description": report.description,
                "report_date": report.report_date,
                "status": report.status,
                "location": {
                    "id": report.location.id,
                    "name": report.location.name,
                    "description": report.location.description,
                },
                "item": {
                    "id": report.item.id,
                    "title": report.item.title,
                    "description": report.item.description,
                    "brand": report.item.brand,
                    "color": report.item.color,
                    "condition": report.item.condition,
                    "category": {
                        "id": report.item.category.id,
                        "name": report.item.category.name,
                    },
                    "photos": get_item_photos(
                        report.item,
                        request,
                    ),
                },
            },
            status=status.HTTP_200_OK,
        )


class ReportManageView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, report_id):
        try:
            report = (
                Report.objects
                .select_related(
                    "item",
                    "location",
                )
                .get(
                    id=report_id,
                    user=request.user,
                )
            )
        except Report.DoesNotExist:
            return Response(
                {"error": "Report not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data

        if "description" in data:
            report.description = data["description"]

        if "location" in data:
            try:
                report.location = Location.objects.get(
                    id=data["location"]
                )
            except Location.DoesNotExist:
                return Response(
                    {"error": "Location not found."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if "report_date" in data:
            report.report_date = data["report_date"]

        report.save()

        item = report.item

        for field in [
            "title",
            "description",
            "brand",
            "color",
            "condition",
        ]:
            if field in data:
                setattr(
                    item,
                    field,
                    data[field],
                )

        if "category" in data:
            try:
                item.category = Category.objects.get(
                    id=data["category"]
                )
            except Category.DoesNotExist:
                return Response(
                    {"error": "Category not found."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        item.save()

        CachingBrowseReportsProxy.clear_cache()

        Logger().log(
            f"User {request.user.username} edited "
            f"Report #{report.id}"
        )

        return Response(
            {
                "message": "Report updated successfully."
            },
            status=status.HTTP_200_OK,
        )

    def delete(self, request, report_id):
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

        deleted_report_id = report.id

        report.delete()

        CachingBrowseReportsProxy.clear_cache()

        Logger().log(
            f"User {request.user.username} deleted "
            f"Report #{deleted_report_id}"
        )

        return Response(
            {
                "message": "Report deleted successfully."
            },
            status=status.HTTP_200_OK,
        )


class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all().order_by("name")

        return Response(
            [
                {
                    "id": category.id,
                    "name": category.name,
                }
                for category in categories
            ],
            status=status.HTTP_200_OK,
        )


class LocationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        locations = Location.objects.all().order_by("name")

        return Response(
            [
                {
                    "id": location.id,
                    "name": location.name,
                }
                for location in locations
            ],
            status=status.HTTP_200_OK,
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
            "strict",
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
                    "photos": get_item_photos(
                        match["item"],
                        request,
                    ),
                }
                for match in matches
            ],
            status=status.HTTP_200_OK,
        )


class AdminReportListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reports = (
            Report.objects
            .select_related(
                "user",
                "location",
                "item",
                "item__category",
            )
            .prefetch_related("item__photos")
            .order_by("-created_at")
        )

        return Response(
            [
                {
                    "id": report.id,
                    "type": report.type,
                    "status": report.status,
                    "owner": report.user.username,
                    "description": report.description,
                    "location": report.location.name,
                    "item": {
                        "title": report.item.title,
                        "category": report.item.category.name,
                        "brand": report.item.brand,
                        "color": report.item.color,
                        "condition": report.item.condition,
                        "photos": get_item_photos(
                            report.item,
                            request,
                        ),
                    },
                }
                for report in reports
            ],
            status=status.HTTP_200_OK,
        )


class AdminReportStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, report_id):
        try:
            report = Report.objects.get(
                id=report_id
            )
        except Report.DoesNotExist:
            return Response(
                {"error": "Report not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        new_status = request.data.get(
            "status"
        )

        if new_status not in [
            Report.ReportStatus.ACTIVE,
            Report.ReportStatus.RESOLVED,
            Report.ReportStatus.CLOSED,
        ]:
            return Response(
                {
                    "error": "Invalid report status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        report.status = new_status
        report.save()

        CachingBrowseReportsProxy.clear_cache()

        Logger().log(
            f"Admin {request.user.username} changed "
            f"Report #{report.id} status to "
            f"{report.status}"
        )

        return Response(
            {
                "message":
                    "Report status updated successfully."
            },
            status=status.HTTP_200_OK,
        )


class AdminReportDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, report_id):
        try:
            report = Report.objects.get(
                id=report_id
            )
        except Report.DoesNotExist:
            return Response(
                {"error": "Report not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        deleted_report_id = report.id

        report.delete()

        CachingBrowseReportsProxy.clear_cache()

        Logger().log(
            f"Admin {request.user.username} deleted "
            f"Report #{deleted_report_id}"
        )

        return Response(
            {
                "message":
                    "Report deleted successfully."
            },
            status=status.HTTP_200_OK,
        )