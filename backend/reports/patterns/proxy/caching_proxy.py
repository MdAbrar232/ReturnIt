from django.core.cache import cache

from reports.patterns.proxy.browse_service import (
    BrowseReportsService,
)


class CachingBrowseReportsProxy:
    """
    Proxy that caches browse-report query results.
    """

    CACHE_TIMEOUT = 60
    CACHE_PREFIX = "browse_reports:"

    def __init__(self):
        self.real_service = BrowseReportsService()

    def get_reports(
        self,
        report_type=None,
        category=None,
        location=None,
        search=None,
    ):
        cache_key = self._build_cache_key(
            report_type,
            category,
            location,
            search,
        )

        cached_reports = cache.get(cache_key)

        if cached_reports is not None:
            print(
                f"CACHE HIT: {cache_key}"
            )
            return cached_reports

        print(
            f"CACHE MISS: {cache_key}"
        )

        reports = self.real_service.get_reports(
            report_type=report_type,
            category=category,
            location=location,
            search=search,
        )

        reports = list(reports)

        cache.set(
            cache_key,
            reports,
            self.CACHE_TIMEOUT,
        )

        return reports

    @classmethod
    def clear_cache(cls):
        """
        Clears cached Browse Reports results.
        """
        cache.clear()

    @staticmethod
    def _build_cache_key(
        report_type,
        category,
        location,
        search,
    ):
        return (
            "browse_reports:"
            f"type={report_type}:"
            f"category={category}:"
            f"location={location}:"
            f"search={search}"
        )