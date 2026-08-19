from django.contrib import admin
from .models import Category, Location, Report, Item, Photo


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "type",
        "location",
        "status",
        "report_date",
        "created_at",
    )

    list_filter = (
        "type",
        "status",
        "location",
    )

    search_fields = (
        "description",
        "user__username",
        "user__university_id",
    )


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
        "brand",
        "color",
        "condition",
    )

    list_filter = (
        "category",
        "condition",
    )

    search_fields = (
        "title",
        "description",
        "brand",
    )


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "item",
        "image",
    )