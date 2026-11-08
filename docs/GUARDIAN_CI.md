# Guardian CI - Chrono Shield Networks

Guardian CI is the validation and build-integrity layer for CSN IA.

## Components

- Guardian Precheck: static repository checks.
- Build APK: Android debug build and SHA-256 generation.
- CodeQL: Java/Kotlin and JavaScript/TypeScript security analysis.
- Guardian Proof of Build: GitHub artifact provenance attestation for
  successful builds pushed to main.
- Guardian Integrity Verification: manual SHA-256 verification for a
  selected Build APK workflow run.
- Local diagnostics: scripts/precheck.sh and scripts/reporte_errores.sh.

## Safety boundaries

- The diagnostic report does not rewrite Android source files.
- The safe Git helper does not stage, commit, pull, or push.
- Pull request builds do not receive attestation permissions.
- Feature branches do not create public releases.
- No automatic AI code repair is claimed by this workflow.
- Static checks do not replace Android compilation or manual testing.

## Build environment

The workflow uses Java 17 and Gradle 8.5, matching the existing Android
Gradle Plugin 8.3 configuration. The Android build files are not modified
by the Guardian installer.

## Artifact verification

The Build APK workflow uploads the APK and SHA256SUMS.txt together.
The Integrity Verification workflow can download the artifact from a
specific run ID and validate its checksum.

For builds on main, GitHub artifact attestations record provenance.
Consumers should verify the attestation using GitHub CLI and the
repository identity before trusting a distributed APK.

## Limitations

The precheck secret scanner is pattern-based and is not a substitute
for a dedicated secret-scanning product.
CodeQL build-mode none is static analysis; it is not a complete runtime
or device-security test.
A successful CI build does not establish that all app features work
on every Android device.
