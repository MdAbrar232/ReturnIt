from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Claim
from .permissions import IsAdminUser
from .serializers import ClaimSerializer

from claims.patterns.adapter.adapters import ProofVerificationAdapter


class ClaimCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ClaimSerializer(data=request.data)

        if serializer.is_valid():
            claim = serializer.save(
                claimant=request.user,
                status=Claim.Status.PENDING,
            )

            return Response(
                ClaimSerializer(claim).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class MyClaimsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        claims = Claim.objects.filter(
            claimant=request.user
        ).order_by("-created_at")

        serializer = ClaimSerializer(
            claims,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ClaimDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, claim_id):
        try:
            claim = Claim.objects.get(
                id=claim_id,
                claimant=request.user,
            )
        except Claim.DoesNotExist:
            return Response(
                {"detail": "Claim not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = ClaimSerializer(claim)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class ClaimCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, claim_id):
        try:
            claim = Claim.objects.get(
                id=claim_id,
                claimant=request.user,
            )
        except Claim.DoesNotExist:
            return Response(
                {"detail": "Claim not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if claim.status != Claim.Status.PENDING:
            return Response(
                {
                    "detail": (
                        f"Claim cannot be cancelled because "
                        f"its current status is {claim.status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        claim.cancel()

        return Response(
            ClaimSerializer(claim).data,
            status=status.HTTP_200_OK,
        )


class AdminClaimListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        claims = Claim.objects.all().order_by("-created_at")

        serializer = ClaimSerializer(
            claims,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class AdminClaimApproveView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, claim_id):
        try:
            claim = Claim.objects.get(id=claim_id)
        except Claim.DoesNotExist:
            return Response(
                {"detail": "Claim not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if claim.status != Claim.Status.PENDING:
            return Response(
                {
                    "detail": (
                        f"Claim cannot be approved because "
                        f"its current status is {claim.status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        adapter = ProofVerificationAdapter()
        verification = adapter.verify(claim)

        if not verification["verified"]:
            return Response(
                {
                    "detail": "Claim evidence could not be verified.",
                    "reason": verification["reason"],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        claim.approve()

        return Response(
            ClaimSerializer(claim).data,
            status=status.HTTP_200_OK,
        )


class AdminClaimRejectView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, claim_id):
        try:
            claim = Claim.objects.get(id=claim_id)
        except Claim.DoesNotExist:
            return Response(
                {"detail": "Claim not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if claim.status != Claim.Status.PENDING:
            return Response(
                {
                    "detail": (
                        f"Claim cannot be rejected because "
                        f"its current status is {claim.status}."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        claim.reject()

        return Response(
            ClaimSerializer(claim).data,
            status=status.HTTP_200_OK,
        )