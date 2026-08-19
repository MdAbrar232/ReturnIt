from rest_framework import serializers

from .models import Claim


class ClaimSerializer(serializers.ModelSerializer):
    claimant = serializers.ReadOnlyField(source="claimant.username")
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Claim
        fields = [
            "id",
            "claimant",
            "item",
            "proof",
            "remarks",
            "status",
            "created_at",
            "updated_at",
        ]