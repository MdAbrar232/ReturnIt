from rest_framework import serializers

from reports.models import Category, Report, Photo


class ItemCreateSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    brand = serializers.CharField()
    color = serializers.CharField()
    condition = serializers.CharField()
    category = serializers.IntegerField()
    image = serializers.ImageField(
        required=False,
        allow_null=True,
    )


class ReportCreateSerializer(serializers.Serializer):
    type = serializers.ChoiceField(
        choices=Report.ReportType.choices
    )
    description = serializers.CharField()
    report_date = serializers.DateField()
    location = serializers.IntegerField()
    item = ItemCreateSerializer()


class PhotoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ["id", "image"]

    def get_image(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url