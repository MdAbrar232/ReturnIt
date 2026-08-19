from datetime import date

from django.test import TestCase

from claims.models import Claim
from claims.patterns.adapter.adapters import ProofVerificationAdapter
from reports.models import Category, Item, Location, Report
from users.models import User


class ProofVerificationAdapterTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="adapter_test",
            university_id="ADAPTER001",
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
            description="Found iPhone",
            report_date=date.today(),
            location=self.location,
        )

        self.item = Item.objects.create(
            report=self.report,
            category=self.category,
            title="Adapter Test Item",
            description="Test item for Adapter Pattern",
            brand="Apple",
            color="Black",
            condition=Item.Condition.GOOD,
        )

        self.claim = Claim.objects.create(
            claimant=self.user,
            item=self.item,
            proof="Original purchase receipt",
            remarks="Testing adapter",
        )

        self.adapter = ProofVerificationAdapter()

    def test_proof_verification(self):
        result = self.adapter.verify(self.claim)

        self.assertTrue(result["verified"])
        self.assertIn("submitted", result["reason"])