# Package security review

This is a deliberately selected evidence set, not a recursive device/workspace
backup. `secrets.py`, calibration files, API credentials, private model-bridge
configuration, phone storage, network names, pairing IDs and raw serial logs were
not included. Source imports/attribute references to secrets remain intact; those
are code, not credential values.

Gitleaks 8.30.1 directory scan, with full finding redaction enabled, returned
**no leaks found**. Its JSON report is `secret-scan.json` (an empty array).
The final manifest verifies every other included file except itself.

Live telemetry was selected by field and known error text. Serial collection
retained only allowlisted message formats; unknown/sensitive lines are withheld.
This observation produced zero serial lines. The firmware source, historical
baselines and patches were inspected for credential assignments; Wi-Fi values are
loaded at runtime from an excluded file, and pairing IDs are derived at runtime.

No automatic scan is a universal guarantee. Before forwarding extra future logs,
apply the same redaction review; do not attach device secrets or an unfiltered
browser/serial dump to this package.
