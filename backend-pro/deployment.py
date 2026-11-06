"""Política de despliegue independiente del proveedor de infraestructura."""

import os


VALID_MODES = {"sovereign", "cloud", "hybrid"}


def get_deployment_mode():
    mode = os.getenv(
        "CSN_DEPLOYMENT_MODE",
        "sovereign"
    ).strip().lower()

    if mode not in VALID_MODES:
        raise RuntimeError(
            "CSN_DEPLOYMENT_MODE debe ser sovereign, cloud o hybrid."
        )

    return mode


def get_deployment_config():
    mode = get_deployment_mode()

    return {
        "mode": mode,
        "sovereign_first": True,
        "cloud_optional": True,
        "provider": os.getenv(
            "CSN_INFRA_PROVIDER",
            "self-hosted"
        ).strip().lower(),
        "offline_license_verification": True,
        "external_services_required": False,
    }
