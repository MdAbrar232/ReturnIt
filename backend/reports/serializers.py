from rest_framework import serializers

from reports.models import Category, Report


class ItemCreateSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    brand = serializers.CharField()
    color = serializers.CharField()
    condition = serializers.CharField()
    category = serializers.IntegerField()


class ReportCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=Report.ReportType.choices)
    description = serializers.CharField()
    report_date = serializers.DateField()
    location = serializers.IntegerField()
    item = ItemCreateSerializer()