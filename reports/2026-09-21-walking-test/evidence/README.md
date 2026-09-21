# Brit's recovery experiments — staged diagnostic capture

These tests use the existing controller firmware without REPL, flashing, reset,
file modification, pairing, or navigation. The first baseline was on the bench
with servo power off. Later the owner placed GrowBot on the floor, requested
native autonomous exploration, and confirmed actual movement and clear space.
See **FLOOR-EXPLORATION.md** for the separate watch-only and polled results.
The early finite runs did not reproduce a failure. A subsequent sustained native
exploration run DID reproduce the drop: see **REPRODUCED-DROP.md** for the exact
timeline, stale-close experiment, unsuccessful recovery and remaining unknowns.

## Instrumentation

`tests/brit_socket_probe.cjs` implements Brit's 20-second stale-OPEN socket close
experiment with additive listeners. It does not replace onmessage/onclose or the
site's reconnect logic. Every new native socket is tracked; receipt of any message
refreshes the watcher's own lastRx. A stale OPEN socket is closed and only the
site's existing reconnect path can recover it. It does not try to repair a socket
stuck in CONNECTING/CLOSING. Close code and clean flag are captured without raw
reason text. Console lines retain the `[gb-stale]` format.

The added lifecycle controls are a finite expiry, duplicate-install guard, and
cleanup that removes only this probe's listeners/timers. Six host tests cover
the threshold, receipt handling, socket replacement, callback preservation,
read-only polling, fault redaction, timeout and cleanup. Host tests use simulated
sockets and do not prove recovery on the real phone.

With polling enabled, only `dog_info` is sent, every 5 seconds, with a 4-second
reply timeout. Each reply includes:

- uptime_ms, memory_free_bytes, wifi_rssi_dbm, reset_cause and firmware label;
- link.failures, connections, radio_resets, heartbeats_sent, pings_sent;
- all retained entries in link.faults, including at_ms, stage and io;
- current link stage/io/close_code.

The host additionally captures socket state, relay presence, phone visibility,
pause/movement flags, incoming-heartbeat uptimes, every poll attempt and missed
reply, forced-close count, replacement sockets and capture start/stop timestamps.
Files are saved incrementally on the host; a debugging gap is recorded separately
from a robot connection failure. A page reload can remove the temporary observer;
it is reported rather than silently reinjected.

### Limits important to interpretation

- Poll replies are incoming traffic and can affect the stale watcher. Record
  watch-only and polling phases separately; do not present a polled baseline as
  an uninstrumented reproduction. Any relay message can refresh lastRx, even if
  it does not prove the chip is alive. Unchanged traffic does not prove health.
- A missing ACK is not by itself a reboot or hang. Compare pre/post uptime and
  fault entries. A short reconnect gap may fall between five-second samples.
- No STALE line in a healthy idle baseline does not disprove a half-open failure
  during walking or phone/network changes. A normal close followed by a replacement
  socket is evidence of that occurrence only.
- Software ACKs and motion flags do not prove physical motion or supply voltage.
- Diagnostic polling allocates temporary objects on the Pico; note it when
  interpreting GC sawtooth/memory behavior. No firmware GC policy is changed.
- Serial is read passively with DTR/RTS false and zero writes. Log timestamps mark
  host receipt, not necessarily when a buffered firmware line was generated.
  Empty output is not a hang. Boot banners and MemoryError are retained as markers.

## Privacy

No WebSocket URLs/pairing identifiers, API keys, Wi-Fi passwords, cookies, model
prompts, camera frames or user transcripts are exported. The native-exploration
trace includes short robot replies from this expressly requested test, plus
allowlisted action outcomes and state; it excludes earlier conversation history.
Unknown error text
and serial lines are withheld, with placeholders preserved, instead of assuming
they are secret-free. This means the report must not describe the serial artifact
as an unredacted/raw log. Expected controller fault messages, errno names, and
MemoryError markers remain visible. Every numeric diagnostic sample is retained;
no averaging removes pre-failure trends.

## Runbook

Use from the private OwlBot outputs working directory after confirming the phone
is attached to debugging and its Chrome endpoint is forwarded to localhost:9223.

```text
node tests/run_brit_socket_probe.cjs bench-idle 45
node tests/run_brit_socket_probe.cjs floor-watch-only 600 --watch-only
node tests/run_brit_socket_probe.cjs floor-poll-and-watch 600
```

These commands do not wake or walk the robot. A floor run requires a fresh owner
confirmation of servo power, floor placement, clear path and supervision. Keep
the USB/power condition and phone screen state documented. Use
`window.__gbBritProbe.mark('walking-start')`, `mark('walking-stop')`,
`mark('screen-lock')` or `mark('observed-drop')` to timestamp observed transitions;
do not insert assumptions as observed events. The observer may be stopped early
using `window.__gbBritProbe.stop()`; stop robot motion separately with its normal
control/power if needed. After each test, verify the probe is inactive.

The passive serial collector is `python tests/collect_brit_serial.py` (45 seconds).
Longer floor serial captures will require an explicitly bounded duration update;
no REPL or serial writes should be added. USB cabling itself can change power
conditions and limit travel, so document rather than conceal that tradeoff.

## Router

The owner identified an Xfinity XB10. Its HTTP admin landing page responds as
XFINITY and requires login. WPA2/WPA3/transition and band steering settings remain
**unknown**: no authentication bypass, security change, or default-mode inference
was attempted. Read the actual setting via owner-authorized UI before classifying it.

## Handoff

This folder is private working evidence, not automatically published to the public
evidence repository. Review/redact and secret-scan any additions before sharing.
The earlier published package remains unchanged.
