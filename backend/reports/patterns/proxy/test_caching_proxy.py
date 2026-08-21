from unittest.mock import patch

from django.core.cache import cache
from django.test import TestCase

from reports.patterns.proxy.browse_service import (
    BrowseReportsService,
)
from reports.patterns.proxy.caching_proxy import (
    CachingBrowseReportsProxy,
)


class CachingBrowseReportsProxyTest(TestCase):

    def setUp(self):
        cache.clear()
        self.proxy = CachingBrowseReportsProxy()

    def tearDown(self):
        cache.clear()

    @patch.object(
        BrowseReportsService,
        "get_reports",
    )
    def test_cache_miss_calls_real_service(
        self,
        mock_get_reports,
    ):
        mock_get_reports.return_value = []

        result = self.proxy.get_reports(
            report_type="LOST"
        )

        self.assertEqual(result, [])

        mock_get_reports.assert_called_once_with(
            report_type="LOST",
            category=None,
            location=None,
            search=None,
        )

    @patch.object(
        BrowseReportsService,
        "get_reports",
    )
    def test_cache_hit_does_not_call_real_service(
        self,
        mock_get_reports,
    ):
        mock_get_reports.return_value = []

        self.proxy.get_reports(
            report_type="LOST"
        )

        self.proxy.get_reports(
            report_type="LOST"
        )

        mock_get_reports.assert_called_once()

    @patch.object(
        BrowseReportsService,
        "get_reports",
    )
    def test_different_filters_use_different_cache_entries(
        self,
        mock_get_reports,
    ):
        mock_get_reports.return_value = []

        self.proxy.get_reports(
            report_type="LOST"
        )

        self.proxy.get_reports(
            report_type="FOUND"
        )

        self.assertEqual(
            mock_get_reports.call_count,
            2,
        )