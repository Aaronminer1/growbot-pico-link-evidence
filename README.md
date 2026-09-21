# GrowBot Pico connection investigation

Evidence prepared for Brit on **21 September 2026**. This is a diagnostic
snapshot of a custom OwlBot Pico controller used with the GrowBot browser app,
not official GrowBot firmware or an installation package.

## Start here

- **[Full report and open questions](evidence/READ-ME-FIRST.md)**
- [Live controller and heartbeat observations](evidence/live-telemetry.json)
- [Passive serial capture](evidence/passive-serial.json)
- [Firmware host copy](evidence/firmware-host-copy/main.py)
- [Last firmware change: 7.13 → 7.14](evidence/main-7.13-to-7.14.patch)
- [Combined network changes: 7.11 → 7.14](evidence/main-7.11-to-7.14.patch)
- [Historical downloaded baseline → custom firmware](evidence/historical-downloaded-baseline-to-7.14.patch)
- [Firmware provenance and installation record](evidence/historical-install-verification.md)
- [Byte sizes and SHA256 manifest](evidence/SHA256-MANIFEST.json)
- [Security review](evidence/SECURITY-REVIEW.md)

## The heartbeat answer

The **five-second heartbeat is JSON carried in a WebSocket TEXT frame (opcode
0x1)**, with `t:"ack"`, `rid:null`, and `event:"heartbeat"`. A separate opcode
`0x9` ping runs every ten seconds and immediately after hello.

Six JSON heartbeats reached the phone during this capture. The client's native
receipt timestamp refreshed for each; these messages were not simply discarded.
The report separates that observation from the half-open-connection recovery issue.

## What this does not prove

- The supplied main.py is the **host copy verified during the earlier installation**,
  not a fresh read of the chip. Current on-chip bytes/hash remain unverified.
- No serial trace spanning the reported walking failure was obtained. The quiet
  serial window overlapped successful heartbeats and is not evidence of a hang.
- The owner reports an Xfinity XB10, Pico power through a Waveshare carrier, and
  observed failures while walking. Router security mode, supply behavior under
  load, and the cause of the failures remain unknown.
- Configured servo assignments are not a fresh physical wiring inspection.

No firmware, website, controller settings, or robot identity was modified during
collection. No movement was commanded. **Do not flash this snapshot or enter the
running Pico REPL to inspect it**: preserve the failing state and account for the
irreversible hardware-watchdog timer first. This custom firmware arms its watchdog
before network startup and disables the usual boot wiggle.

## Repository scope and handling

The `evidence/` directory preserves the reviewed package byte-for-byte, including
source baselines and text diffs. Its manifest covers all original package files
except the manifest itself. Git attributes disable newline conversion there so
hashes remain useful across Windows and other systems.

Only selected, redacted diagnostics and source files are included. No device
secrets.py, API keys, pairing identifiers, private conversations, or model-bridge
credentials are intended to be present. Gitleaks found no leaks in the package;
this is not a guarantee for future uploads. Review and redact any additional logs.

GrowBot upstream: https://github.com/britcruise9/GrowBot .
OwlBot adaptation: https://github.com/Aaronminer1/owlbot .
Source is shared under the retained [PolyForm Noncommercial license](LICENSE.txt).
This evidence repository does not replace either project's source repository.
