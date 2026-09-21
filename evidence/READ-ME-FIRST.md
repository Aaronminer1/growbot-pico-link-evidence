# GrowBot / custom Pico evidence for Brit — 21 September 2026

## Direct answer: the five-second heartbeat is JSON, not opcode 0x9

The custom controller sends a **WebSocket TEXT frame (opcode 0x1)** approximately
every 5 seconds. Actual phone-received payload at 17:41:15.901 UTC:

```json
{"t":"ack","rid":null,"ok":1,"event":"heartbeat","uptime_ms":4490286,"physical_feedback":false}
```

It ALSO sends a separate **WebSocket PING opcode 0x9 every 10 seconds**, plus
one immediately after hello. Those are different mechanisms. The JSON heartbeat
is unsolicited: null `rid`, not acknowledgment of a movement request, and it does
not renew movement authority. Source: main.py lines 123–124, 284–285, 718–720,
796–809 in the supplied host copy.

We observed six JSON heartbeats on the phone from 17:41:15.901 to 17:41:40.961 UTC.
The native `_bodyRxT` timestamp was freshly updated for every captured heartbeat
(receipt age 0 ms when sampled). The inspected GrowBot client dispatches `t:ack`
to `onAck`, whose callback updates `_bodyRxT` (snapshot included in
`browser-heartbeat-handlers.json`). Thus, in this client, these frames
are **not discarded as unknown messages**. The unresolved issue is using stale
proof of life to detect/recover a half-open connection, not a missing JSON sender.
This does not establish how every other deployed client version behaves.

## Preservation and limitations

- No flashing, main.py edits, REPL entry, reset, bootloader entry, servo commands,
  pairing/reconnect action, browser settings change, or website patch was performed
  for this collection. GrowBot was paused and idle during the successful capture.
- Only existing read-only `dog_info` and `dog_cal/channel_action:info` requests were
  sent. Browser listeners observed existing traffic without replacing callbacks.
- USB was opened passively for 45 seconds with DTR/RTS false and **zero writes**.
- **The exact current on-chip main.py bytes, size and SHA256 remain unknown.**
  The existing non-mutating relay diagnostics expose version/state, not file hashes.
  We did not enter REPL to obtain a dump because that risks the watchdog reset you
  warned about. No claim of a fresh chip-file read is being made.

## Firmware copy, provenance, and exact changes

The supplied `firmware-host-copy/main.py` is the local source that the earlier
installation record says was compiled on the Pico and read-back hash verified:

```text
bytes: 43693
SHA256: 13fd76356638558359ef42251571c28af0a83072cc6687c71161d9f0d0437151
```

The local size/hash were rechecked for this package; runtime diagnostics currently
report `owlbot-pico-7.14`. Version matching alone does not prove file identity.
See `historical-install-verification.md` for the earlier installation evidence.
Other module copies are also host copies, not freshly read chip files.

This is **our OwlBot adaptation of GrowBot firmware**, not stock GrowBot firmware.
Historical provisioning records say the original GrowBot `relay_chip.py`,
`PicoRobotics.py`, and `act_engine.py` were downloaded and installed on 11 August
2026, with read-back hashes matching then. The retained three-file download set
is included under `baseline-downloaded-20260811`. Exact upstream commit/release
for that download is **unknown**; it must not be called today's stock code.
The MicroPython UF2 came from `https://growbot.dev/firmware/micropython-pico2w.uf2`.
This package does not include that binary or any credentials.

Diffs supplied:

- `historical-downloaded-baseline-to-7.14.patch`: retained downloaded entrypoint
  (`relay_chip.py` renamed to `main.py`), driver changes, and the added runtime
  modules. `relay_chip.py` in the current copy is an identical entrypoint mirror;
  its duplicate diff is omitted. Old `act_engine.py` is included for reference;
  no deletion from the chip is claimed, and the current entrypoint no longer
  imports it. This is a final-state comparison, not a reconstruction of every
  intermediate edit or GrowBot's subsequent upstream changes.
- `main-7.11-to-7.14.patch`: combined recent network changes, against the retained
  pre-7.12 backup; `main-7.13-to-7.14.patch`: last installation's exact text delta.
- Both network baseline files and current module files are included so changes
  are independently reviewable. Source copies preserve original bytes; unified
  text diffs normalize line endings. `SHA256-MANIFEST.json` records raw-byte hashes.

Major custom areas: saved calibrated four-leg/slide walking, turns, slow held head
control, original L/R pose interpretation, saved gesture/turn aliases, additional
command/diagnostic lanes, app heartbeats, receive deadlines and recovery diagnostics.
Reviewed source is also published at https://github.com/Aaronminer1/owlbot under
`firmware/pico`; this package's host-copy hashes are the precise evidence here.
GrowBot license/credit are retained in `LICENSE.txt`.

Two source differences from the stock assumptions are important:

- This entrypoint arms its 8-second watchdog **before network startup** (line 815),
  not only at first relay connect. We have not attempted REPL.
- Automatic boot calibration/wiggle is disabled (`if False and _cold_boot()`, line
  895). **No boot wiggle cannot rule out a reboot with this build.** Watch uptime,
  the serial boot banner, reset metadata, or USB enumeration instead.

Some old comments mention generic six-servo defaults, earlier head reservations,
or brownouts as a known cause. Those are not evidence of this unit's present
wiring or the cause of this failure. They have deliberately not been tidied.

## Board, runtime and wiring

MicroPython **1.28.0** was returned by the live `os.uname().release` diagnostic.
Historical provisioning identified **Raspberry Pi Pico 2 W / RP2350** through
BOOTSEL and the MicroPython board string. We did not re-enter BOOTSEL or inspect
the physical PCB today. The owner identifies a **Waveshare Pico Servo Driver**
carrier. Runtime `host`/`board` labels are hardcoded, so those alone were not used
as independent hardware identification.

Live saved channel assignments (zero-based, not the driver's one-based API):

| Servo | Live configured channel | Direct-PWM code mapping, if this driver path is active |
|---|---:|---|
| Left front leg | 1 | GP1 |
| Left rear leg | 2 | GP2 |
| Right rear leg | 3 | GP3 |
| Right front leg | 5 | GP5 |
| Slide | 6 | GP6 |
| Turn | 7 | GP7 |
| Head pan | 8 | GP8 |
| Head tilt | 9 | GP9 |

**Physical cable-to-leg verification is unknown for this collection.** The table
reports live configuration plus source mapping, not a visual or continuity-test
inspection. `servo_channels.py` sends channel+1 to the driver; the `dog6` direct
profile maps driver port n to GP(n-1). The driver also supports I2C detection;
its selected backend was not independently read back. Do not infer actual wires
solely from this table. Older disabled/default channels are not active leg wiring.

## Power and network — owner observations vs unknowns

- Owner confirms Pico is powered **through the Waveshare board**.
- USB is connected for this collection. Whether USB power is electrically combined
  with the board supply, the precise rail/regulator topology, servo supply voltage,
  current rating, battery details and voltage under load are **unknown**.
- Owner had said main/servo power was disconnected before this diagnostic exchange.
  Today's power reply confirmed the Pico source but did not explicitly reconfirm
  the current servo switch position. No powered motion was attempted.
- Router: **Xfinity XB10**, owner confirmed. Configured bands/SSID steering and
  WPA2/WPA3/transition setting are **unknown**. Model alone does not establish them.
- Live Pico RSSI during the successful paused collection: **-69 to -70 dBm**;
  preceding six diagnostic replies ranged -70 to -68 dBm. These are current-location
  samples, **not RSSI measured along the actual walking path**.
- Owner has observed disconnects **only while walking**. Controlled idle and phone
  screen-lock comparisons have not established their failure rates. No assertion
  that idle/screen-lock drops cannot occur is justified.
- Owner clarified the sequence: connection lost first; manually enabled connection
  in Brain; pairing prompt appeared; then GrowBot reloaded. We are not claiming a
  spontaneous reload preceded the initial failure.

## Fresh observations and requested serial failure classification

See `live-telemetry.json` (17:41:10.930–17:41:41.575 UTC):

- Firmware 7.14, MicroPython 1.28.0, GrowBot paused, no browser movement.
- Uptime 4,485,381 → 4,515,840 ms (about 75 minutes since this firmware boot).
- 4 relay connections, 7 accumulated failures, 5 radio resets; all unchanged during
  this 30-second observation. Heartbeats 872 → 878; pings 439 → 442.
- Numeric reset_cause is 1. Its symbolic meaning was not queried on-device; we
  do not label it as an unexplained power/watchdog reset.
- Retained four-entry RAM fault ring:

| Milliseconds after firmware boot | Stage / I/O | Recorded error |
|---:|---|---|
| 82907 | wifi_association / idle | Wi-Fi association did not complete |
| 182514 | serving / first_byte_read | relay closed the stream |
| 2149235 | serving / first_byte_read | [Errno 104] ECONNRESET |
| 3786050 | serving / first_byte_read | relay closed the stream |

The last two faults were absent from an earlier 16:43 UTC sample (then 2 connections,
5 failures, 5 radio resets); current uptime continued from that sample. This is
evidence of additional socket failures and recovery in the same observed boot,
not a full MCU reboot at each recorded fault. The messages do not identify which
network element reset/closed the stream. `close_code:null` is not a relay close
reason. Motion/phone-screen state at those exact failures is **unknown**.

`passive-serial.json` covers 17:41:20.827 UTC for 45.093 seconds on COM5:
**zero complete lines and no partial line**. Heartbeat receipts overlapped this
quiet serial window. Therefore this is **not evidence of a hang** and is not the
requested last-80-lines-across-a-failure capture. That capture is **not yet obtained**.

Earlier passive serial observation recorded association failure followed by
recovery (marker-only extraction, not raw lines): +0.21 s fresh association,
+15.24 s WIFI_FAIL/retry, +31.24 s radio bounce, +32.71 s fresh association,
+38.34 s WIFI_OK, +39.10 s successful handshake/hello. It did not preserve the
numeric Wi-Fi status, boot banner, or 80-line context. It cannot establish the
cause of the owner's walking failure.

**Owner-reported walking failure: REBOOT vs HANG remains UNKNOWN.** Recent retained
faults show recoverable transport failures, but we did not capture the original
walking event, observe legs during it, or measure the supply. WPA3 transition,
radio/power disturbance, relay/network closure and phone liveness behavior remain
distinct hypotheses. A reboot alone would not prove brownout: software reset and
watchdog are also possible.

## Minimal next evidence to close the gaps (not performed here)

1. Keep firmware/settings unchanged. During a supervised reproduction, passively
   record serial and phone heartbeat/close observations on a common timeline.
   Keep the normal power/USB condition documented; USB can change power conditions.
2. Record an idle interval and then the walking event. Mark movement onset, screen
   lock/unlock, user reconnect actions and visible behavior. Retain the last ~80
   redacted lines across failure, uptime before/after, boot banner if any, and
   precise Wi-Fi status. Do not enter REPL to investigate the failure in progress.
3. Photograph/confirm the servo plug positions and power wiring; measure the Pico
   supply during load if appropriate equipment is available. Separately read the
   XB10 security setting; don't change it before the baseline capture.
4. If a fresh on-chip file hash is mandatory, arrange a deliberate maintenance
   stop/reboot separately and label it as such. Do not sacrifice the failure state
   by quietly dropping into REPL now.

No passwords, API keys, pairing identifiers, browser storage, private conversation,
or model-bridge credentials are intentionally included. Unknown serial lines are
withheld by the supplied collector. Secret-scanner results accompany the package;
automated scanning is a check, not proof that arbitrary data can never contain a secret.
