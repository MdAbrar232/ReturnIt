from django.urls import path

from .views import (
    ClaimCreateView,
    MyClaimsView,
    ClaimDetailView,
    ClaimCancelView,
    AdminClaimListView,
    AdminClaimApproveView,
    AdminClaimRejectView,
)


urlpatterns = [
    path(
        "",
        ClaimCreateView.as_view(),
        name="claim-create",
    ),
    path(
        "my/",
        MyClaimsView.as_view(),
        name="my-claims",
    ),
    path(
        "admin/",
        AdminClaimListView.as_view(),
        name="admin-claim-list",
    ),
    path(
        "<int:claim_id>/cancel/",
        ClaimCancelView.as_view(),
        name="claim-cancel",
    ),
    path(
        "<int:claim_id>/",
        ClaimDetailView.as_view(),
        name="claim-detail",
    ),
    path(
    "admin/<int:claim_id>/approve/",
    AdminClaimApproveView.as_view(),
    name="admin-claim-approve",
    ),
    path(
    "admin/<int:claim_id>/reject/",
    AdminClaimRejectView.as_view(),
    name="admin-claim-reject",
    ),
]

