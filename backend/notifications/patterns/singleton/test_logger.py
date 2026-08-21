from pathlib import Path

from django.test import SimpleTestCase

from notifications.patterns.singleton.logger import Logger


class LoggerSingletonTest(SimpleTestCase):

    def test_logger_returns_same_instance(self):
        logger1 = Logger()
        logger2 = Logger()

        self.assertIs(logger1, logger2)

    def test_logger_writes_message(self):
        logger = Logger()

        message = "Unit test log message"
        logger.log(message)

        log_file = (
            Path(__file__).resolve().parents[3]
            / "logs"
            / "returnit.log"
        )

        self.assertTrue(log_file.exists())

        with open(
            log_file,
            "r",
            encoding="utf-8",
        ) as file:
            contents = file.read()

        self.assertIn(message, contents)