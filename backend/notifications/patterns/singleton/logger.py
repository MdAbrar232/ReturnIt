from datetime import datetime
from pathlib import Path


class Logger:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance

    def log(self, message):
        log_directory = (
            Path(__file__).resolve().parents[3] / "logs"
        )

        log_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        log_file = log_directory / "returnit.log"

        timestamp = datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )

        with open(
            log_file,
            "a",
            encoding="utf-8",
        ) as file:
            file.write(
                f"[{timestamp}] {message}\n"
            )