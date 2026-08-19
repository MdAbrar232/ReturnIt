from django.test import TestCase

from claims.models import Claim
from reports.models import Category, Item, Location, Report
from users.models import User


class ClaimModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="claim_test",
            university_id="CLAIM001",
            password="test1234",
        )

        self.category = Category.objects.create(
            name="Electronics",
        )

        self.location = Location.objects.create(
            name="University Library",
            description="Main university library",
        )

        self.report = Report.objects.create(
            user=self.user,
            type=Report.ReportType.FOUND,
            description="Found phone",
            report_date="2026-08-18",
            location=self.location,
        )

        self.item = Item.objects.create(
            report=self.report,
            category=self.category,
            title="Test iPhone",
            description="Test phone",
            brand="Apple",
            color="Black",
            condition=Item.Condition.GOOD,
        )

    def create_claim(self):
        return Claim.objects.create(
            claimant=self.user,
            item=self.item,
            proof="Original purchase receipt",
            remarks="Test claim",
        )

    def test_pending_claim_can_be_approved(self):
        claim = self.create_claim()

        claim.approve()

        self.assertEqual(
            claim.status,
            Claim.Status.APPROVED,
        )

    def test_pending_claim_can_be_rejected(self):
        claim = self.create_claim()

        claim.reject()

        self.assertEqual(
            claim.status,
            Claim.Status.REJECTED,
        )

    def test_pending_claim_can_be_cancelled(self):
        claim = self.create_claim()

        claim.cancel()

        self.assertEqual(
            claim.status,
            Claim.Status.CANCELLED,
        )

    def test_approved_claim_cannot_be_cancelled(self):
        claim = self.create_claim()

        claim.approve()

        with self.assertRaises(ValueError):
            claim.cancel()

    def test_rejected_claim_cannot_be_approved(self):
        claim = self.create_claim()

        claim.reject()

        with self.assertRaises(ValueError):
            claim.approve()

    def test_cancelled_claim_cannot_be_rejected(self):
        claim = self.create_claim()

        claim.cancel()

        with self.assertRaises(ValueError):
            claim.reject()

from rest_framework.test import APIRequestFactory, force_authenticate

from claims.permissions import IsAdminUser


class IsAdminUserTest(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()

        self.student = User.objects.create_user(
            username="permission_student",
            university_id="PERM001",
            password="test1234",
            role="STUDENT",
        )

        self.admin = User.objects.create_user(
            username="permission_admin",
            university_id="PERM002",
            password="test1234",
            role="ADMIN",
        )

    def test_student_is_denied(self):
        request = self.factory.get("/api/claims/admin/")
        request.user = self.student

        permission = IsAdminUser()

        self.assertFalse(
            permission.has_permission(request, None)
        )

    def test_admin_is_allowed(self):
        request = self.factory.get("/api/claims/admin/")
        request.user = self.admin

        permission = IsAdminUser()

        self.assertTrue(
            permission.has_permission(request, None)
        )