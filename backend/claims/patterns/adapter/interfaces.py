from abc import ABC, abstractmethod


class ClaimVerificationAdapter(ABC):
    @abstractmethod
    def verify(self, claim):
        """
        Verify the evidence provided for a claim.

        Returns:
            dict containing verification result and explanation.
        """
        pass