import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from network_brain import analyze


class NetworkBrainTests(unittest.TestCase):

    def test_network_intentions(self):
        cases = [
            ("Quiero conectar tres nodos mesh", "connect", False),
            ("Conecta ahora tres nodos mesh", "connect", True),
            ("Quiero navegar por internet con DNS seguro", "secure", False),
            ("Aplica una configuración DNS segura", "secure", True),
            ("Mi red privada WireGuard no funciona", "diagnose", False),
            ("Consulta el estado de mis servidores", "status", False),
        ]

        for message, action, authorization in cases:
            with self.subTest(message=message):
                result = analyze(message)
                self.assertEqual(result["action"], action)
                self.assertEqual(
                    result["requires_authorization"], authorization
                )

    def test_domains(self):
        cases = [
            ("Mi red privada WireGuard", "private_network"),
            ("Conectar nodos mesh", "mesh_federation"),
            ("Estado del centro de datos", "data_center"),
            ("DNS y gateway seguro", "secure_gateway"),
            ("Soberanía digital", "sovereignty"),
            ("Continuidad sin internet", "continuity"),
        ]

        for message, domain in cases:
            with self.subTest(message=message):
                self.assertEqual(analyze(message)["domain"], domain)

    def test_empty_message_rejected(self):
        with self.assertRaises(ValueError):
            analyze("")

    def test_non_string_rejected(self):
        with self.assertRaises(ValueError):
            analyze(None)

    def test_oversized_message_rejected(self):
        with self.assertRaises(ValueError):
            analyze("A" * 4001)


if __name__ == "__main__":
    unittest.main(verbosity=2)
