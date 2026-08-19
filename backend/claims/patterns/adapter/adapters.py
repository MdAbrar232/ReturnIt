from .interfaces import ClaimVerificationAdapter


class ProofVerificationService:
    """
    Existing-style proof verification component.

    This represents a verification service whose interface
    is different from the Claim system's expected interface.
    """

    def check_proof(self, proof, item):
        if not proof or not proof.strip():
            return {
                "verified": False,
                "reason": "No proof was provided.",
            }

        return {
            "verified": True,
            "reason": "Proof has been submitted for administrator review.",
        }


class ProofVerificationAdapter(ClaimVerificationAdapter):
    """
    Adapter that converts the proof verification service's
    interface into the interface expected by the Claim system.
    """

    def __init__(self):
        self.verification_service = ProofVerificationService()

    def verify(self, claim):
        result = self.verification_service.check_proof(
            claim.proof,
            claim.item,
        )

        return {
            "verified": result["verified"],
            "reason": result["reason"],
        }