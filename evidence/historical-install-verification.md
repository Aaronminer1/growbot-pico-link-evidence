# Pico link recovery 7.14

Scope: original GrowBot, servo power owner-confirmed OFF, USB COM5 connected.
GrowBot remains paused. No website, identity, provider or movement-profile changes.
Tests issue controller commands with the servo rail OFF: they do not prove motion.

## Evidence and changes

7.12 corrected proven heartbeat starvation during sustained incoming pose traffic.
It did not eliminate all failures; see LINK-7.12.md. Version 7.13 temporarily added
I/O-phase diagnostics. After that maintenance restart, the browser reported an
open socket and awake body but received no Pico replies/heartbeats for over
50 seconds. Automatic radio reset after three failures restored replies.
Later TCP timeouts overwrote the original failure, preventing exact attribution.
This supports improving recovery; it does not identify the original network fault.

7.14 retains the 5-second application heartbeat and 10-second websocket ping,
and also sends a ping immediately after hello. Until the first received frame,
a session has a 10-second receive deadline. Thereafter it retains 25 seconds.
Sent messages NEVER refresh receive liveness or motor authority.

On a receive-deadline failure, existing movement cancellation/hold runs, then
the radio is reset immediately rather than waiting for three failures. Other
failures retain the graduated retry/backoff/watchdog behavior. No old motion
is replayed after reconnect. Actual recovery time includes radio association,
TCP/TLS and backoff; 10 seconds is a detection budget, NOT an uptime guarantee.

Diagnostics now retain the latest four faults in RAM with elapsed time, stage,
I/O operation and bounded error text. Radio resets are counted; websocket close
codes are recorded without reason text. No flash logging or private config export.
The phase marker resets for each connection attempt so a TCP failure is not
mislabelled with the preceding session's I/O operation.

The browser observer attaches passive listeners to native sockets, follows
replacement sockets, and records close code/clean flag/reason length only.
It does not alter the website, callbacks, retry timing, body settings or identity.
Phone power diagnostics during this turn: awake, screen on, device-idle ACTIVE,
network connected. This is not proof of phone state at older outages.

## Installation and rollback

Canonical main.py and relay_chip.py are identical. Installed main.py compiled
on MicroPython and read-back SHA-256 matched:
13fd76356638558359ef42251571c28af0a83072cc6687c71161d9f0d0437151.

Only main.py changed. Hashes of stock_commands.json, named_walk.json and
servo_channels.json match the earlier backups. Private pre-7.14 backup:
network-baselines/main-7.13.py (copied from the private pre-install backup).
Pico retains main.py.pre714 (7.13); main.py.pre713 is the prior 7.12 build.
Use servo power off and GrowBot paused before restoring firmware.

The maintenance watchdog restarted the device normally after upload. A
subsequent manual recovery helper could not open COM5 during enumeration and
made no changes; the Pico then connected on its own. Fresh uptime/reset cause
from this planned restart must not be counted as an unexplained field reset.

## Verification

- 20 host relay tests: cadence under traffic, idle replies, silent new session,
  established-session deadline, Wi-Fi loss, write failure, bounded fault history,
  operation attribution, radio recovery decision and existing frame/TLS tests.
  The actual main() recovery path also verifies cancel/hold precedes radio reset.
- Actual serve-function simulation: 2,000 frames / 40 seconds, eight application
  heartbeats, five pings including the initial probe, 16,000 actuator ticks.
- 73 stock tests and 24 head-support tests pass.
- First six live 7.14 requests: all ACKed in 136–274 ms; one connection,
  zero failures/radio resets, RSSI -28 to -30 dBm, no fault history.
- Passive 45-second USB window after startup: no error/reset/reconnect markers.

- Three consecutive original-policy replays passed (331 + 330 + 339 = 1,000
  emitted pose samples; 4 + 5 + 5 commanded walking cycles). Each verified
  four-leg coordination, Closed turn, 60% lift, held head and frozen-input stop.
- Native routine-name alias replays spin_left, spin_right, spin_left all completed
  their canonical turns and commanded return Closed. These do not validate the
  unlabelled autonomous browser spin policy (a separate known limitation).
- Three overlapping 40-second passive browser windows each received eight
  heartbeats, with maximum gaps 5,088 / 5,254 / 5,190 ms. No websocket close/error,
  replacement or offline-presence event occurred in those windows.
- All 18 inter-round controller requests succeeded in 131–234 ms; one serving
  connection, zero failures, zero radio resets, empty fault history at every
  sample. Uptime advanced continuously to 245 seconds.

- Final 32-second idle check (no requests): six heartbeats, max gap 5,028 ms,
  socket continuously open, relay presence online, native receipt age below
  five seconds; heartbeat uptime advanced from 249,864 to 274,903 ms.
- Final state at approximately 05:13:43 UTC: paused, no browser motion, no
  active saved command/walk/turn, no remaining commanded PWM outputs. The
  power-off helpers deliberately issued explicit release after each test.
  The production head-hold configuration remains enabled and unchanged.
- Final six read-only controller replies at 05:14:03–05:14:14 UTC succeeded in
  127–278 ms. Uptime reached 309,374 ms; still one connection, zero failures,
  zero radio resets, empty fault history, 58 heartbeats and 30 pings. Thus the
  final installed build stayed connected for almost five minutes after serving
  began, including both sustained traffic and quiet periods.

The bounded soak completed successfully. Three observer windows and the final
idle window were inspected explicitly for close/error events and continuity.
The soak runner was subsequently hardened to assert these observer results
as well as its preexisting controller-counter checks.

## Limits

This firmware improves fault detection and recovery, not the remote relay or
Android browser. A clean bounded test cannot prove intermittent Internet,
relay, or phone failures are gone. No relay/backend logs are available here.
No powered walking, electrical load test or autonomous floor run occurred.
