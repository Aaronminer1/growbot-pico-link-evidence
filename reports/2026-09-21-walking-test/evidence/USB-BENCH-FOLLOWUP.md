# USB bench follow-up after the reproduced walking failure

2026-09-21. Owner reports Pico USB connected and main power disconnected.
Owner subsequently confirmed USB was connected FIRST, then main power was
disconnected. There was no intended interval with both supplies absent; actual
electrical continuity/voltage during the transfer was not measured. Do NOT label
this a deliberate full power cycle. Both supplies briefly overlapped contrary
to the manufacturer's guidance; the owner has now confirmed main power off.
The artifact label `controlled-usb-restart` was chosen before reading the reset
diagnostics and before the ordering was confirmed; it is not proof that attaching
USB caused this boot/recovery. The original artifact is retained unchanged.

## Confirmed observations

- Windows sees COM5, USB Serial Device, VID 2E8A / PID 0005.
- GrowBot is paused, with no movement or in-flight model request.
- Passive serial capture from 22:38:21.227551 UTC for 45.122 seconds: zero serial
  writes, DTR=false, RTS=false, zero complete lines and no partial line. Silence
  is not a hang, and this is NOT a serial log of the earlier floor failure.
- Separate 45-second dog_info capture with stale closing disabled: nine successful
  replies, zero misses; no extra reset, REPL, firmware write or movement command.
- Firmware label remains owlbot-pico-7.14. First diagnostic at 22:38:33.256 UTC:
  uptime=283,228 ms, reset_cause=3, RSSI=-71 dBm, memory_free_bytes=289,696.
  Last diagnostic at 22:39:13.288: uptime=323,253 ms, memory=323,184, RSSI=-71.
- Current-boot counters: failures=5, connections=1, radio_resets=6, unchanged
  across the observation. The four retained fault-ring entries are Wi-Fi
  association failures, stage=wifi_association, io=idle, at uptimes 36,452,
  56,953, 82,921 and 115,422 ms. The ring retains only the latest four; do not
  invent the omitted fifth entry's details.

## Interpretation and limits

The current boot is different from the pre-drop boot (which had uptime over
2.3 million ms). However, reset_cause=3 alone does not identify an unresponsive
watchdog expiry. In MicroPython v1.28.0 for RP2, code 3 is WDT_RESET, and the
implementation of machine.reset() also uses watchdog_reboot. The inspected host
firmware likewise explicitly documents that both mechanisms share WDT_RESET.
It contains a deliberate machine.reset() self-heal path after repeated connection
failures. This source shows possible mechanisms, not proof of which occurred.

Primary source:
https://github.com/micropython/micropython/blob/v1.28.0/ports/rp2/modmachine.c
(RP2_RESET_WDT definition, mp_machine_reset and mp_machine_reset_cause).

Subtracting reported uptime from the first host receipt places main.py's BOOT_MS
reference near 22:33:50 UTC, approximately; host/transport latency and startup
initialization prevent treating it as an exact electrical power-on timestamp.
The owner's USB-first sequence rules out describing this as an intentionally
unpowered transition, but cannot establish which reset mechanism occurred or
exclude a supply transient. No live serial boot/reset message was captured, so
the trigger is presently unknown; do not assign recovery to USB or self-healing
solely from this ordering.

The earlier report's no-recovery finding still applies to its measured windows,
ending 22:32:29.381 UTC. This later reconnection does not retroactively prove the
temporary stale-socket fix restored the Pico within those windows.

## Files

- `controlled-usb-restart-*.json`: nine current-boot diagnostic replies.
- `passive-serial-2026-09-21T22-38-21-227551+00-00.json`: empty passive serial window.

No public repository changes. Robot remains paused; no firmware changes.
