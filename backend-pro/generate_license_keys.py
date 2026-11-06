from pathlib import Path
import os

from license_engine import generate_keypair

directory = Path.home() / ".config" / "csn-ia"
directory.mkdir(parents=True, exist_ok=True)
directory.chmod(0o700)

private_path = directory / "license-private.key"
public_path = directory / "license-public.key"

if private_path.exists() or public_path.exists():
    raise SystemExit(
        "Ya existen claves. No se sobrescribirán automáticamente."
    )

keys = generate_keypair()

private_path.write_text(
    keys["private_key_b64"] + "\n",
    encoding="utf-8"
)
public_path.write_text(
    keys["public_key_b64"] + "\n",
    encoding="utf-8"
)

private_path.chmod(0o600)
public_path.chmod(0o644)

print("Nuevo par Ed25519 creado correctamente.")
print("Clave privada: almacenamiento protegido fuera del proyecto.")
print("Clave pública: disponible para distribuir a verificadores.")
