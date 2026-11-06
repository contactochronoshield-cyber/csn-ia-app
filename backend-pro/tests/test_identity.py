import sys
import tempfile
import unittest

from pathlib import Path
from datetime import datetime, timedelta, timezone

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import identity


class IdentityTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.original_db_path = identity.DB_PATH
        identity.DB_PATH = Path(self.temp_dir.name) / "identity-test.db"
        identity.initialize_db()

    def tearDown(self):
        identity.DB_PATH = self.original_db_path
        self.temp_dir.cleanup()

    def create_organization(self):
        license_data = identity.issue_license(
            organization_name="Chrono Test",
            plan="enterprise",
            max_seats=5
        )
        owner = identity.activate_organization(
            license_data["license_key"],
            "owner@example.com",
            "ClaveSegura-2026!"
        )
        return license_data, owner

    def test_license_activation_creates_owner(self):
        _, owner = self.create_organization()
        self.assertEqual(owner["role"], "owner")
        self.assertEqual(owner["organization_name"], "Chrono Test")

    def test_license_can_only_be_activated_once(self):
        license_data = identity.issue_license("Empresa Test")
        identity.activate_organization(
            license_data["license_key"],
            "one@example.com",
            "ClaveSegura-2026!"
        )

        with self.assertRaises(identity.IdentityError):
            identity.activate_organization(
                license_data["license_key"],
                "two@example.com",
                "OtraClaveSegura-2026!"
            )

    def test_login_and_session_authentication(self):
        _, owner = self.create_organization()

        session = identity.login(
            "owner@example.com",
            "ClaveSegura-2026!",
            owner["organization_id"]
        )

        principal = identity.authenticate_session(
            session["access_token"]
        )

        self.assertEqual(principal["role"], "owner")
        self.assertEqual(
            principal["organization_id"],
            owner["organization_id"]
        )

    def test_wrong_password_rejected(self):
        _, owner = self.create_organization()

        with self.assertRaises(identity.IdentityError):
            identity.login(
                "owner@example.com",
                "ContraseñaIncorrecta",
                owner["organization_id"]
            )

    def test_session_revocation(self):
        _, owner = self.create_organization()

        session = identity.login(
            "owner@example.com",
            "ClaveSegura-2026!",
            owner["organization_id"]
        )

        identity.logout(session["access_token"])

        with self.assertRaises(identity.IdentityError):
            identity.authenticate_session(session["access_token"])

    def test_expired_license_rejected(self):
        expiration = (
            datetime.now(timezone.utc) - timedelta(days=1)
        ).isoformat()

        license_data = identity.issue_license(
            "Empresa Expirada",
            expires_at=None
        )

        with identity.connect() as db:
            db.execute(
                "UPDATE licenses SET expires_at = ? WHERE id = ?",
                (expiration, license_data["license_id"])
            )

        with self.assertRaises(identity.IdentityError):
            identity.activate_organization(
                license_data["license_key"],
                "expired@example.com",
                "ClaveSegura-2026!"
            )

    def test_short_password_rejected(self):
        license_data = identity.issue_license("Empresa Clave")

        with self.assertRaises(identity.IdentityError):
            identity.activate_organization(
                license_data["license_key"],
                "user@example.com",
                "corta"
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
