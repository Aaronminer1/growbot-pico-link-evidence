# Bench baseline result — 21 September 2026

Owner confirmed: on bench, servo power off. Phone visible and GrowBot paused;
no movement sent. Firmware not changed; no REPL/reset. This is setup validation,
**not the powered walking test requested by Brit**.

Capture: `bench-idle-2026-09-21T21-45-16-555Z.json`.
Browser probe ran 21:45:17.795–21:46:02.796 UTC, with stale-close threshold 20 s
and dog_info polls every 5 s. Nine requests returned successfully in 131–280 ms.
No stale OPEN socket, forced close, socket close, or new fault was observed.
The probe expired and all its timers/listeners were removed; final state checked
paused, no active motion, original socket open, observer inactive.

One extra poll was launched exactly as the original 45-second expiry fired; the
collector canceled its waiter and logged `capture_stopped_with_request_pending`.
That is **not a dropped ACK or controller failure**. The original artifact is
preserved unchanged. The collector now prevents polls at expiry and separately
counts cleanup-canceled requests. Six host tests pass including that boundary.

| Metric | First sample | Last sample |
|---|---:|---:|
| uptime_ms | 19132249 | 19172259 |
| link.failures | 10 | 10 |
| link.connections | 7 | 7 |
| link.radio_resets | 5 | 5 |
| link.heartbeats_sent | 3792 | 3800 |
| link.pings_sent | 1904 | 1908 |

RSSI ranged **-75 to -73 dBm**, measured at the bench, not along the walking path.
Free memory ranged **13,504–280,784 bytes** and rose again after falling. This
pattern is consistent with garbage collection; it is not a measured GC trace and
does not exclude a memory failure under walking load.

The four retained faults were `relay closed the stream`, all serving /
first_byte_read, at firmware uptimes 3786050, 7559278, 10947033 and 17265374 ms.
The last two were absent from the earlier 18:44 UTC diagnostic (8 failures /
5 connections). Continued uptime supports recovery without a firmware reboot
across the observed interval. Actual movement, phone screen and power state at
the times of those older faults were not continuously recorded: **unknown**.
No relay close code was available in the controller's retained ring.

Passive COM5 serial: 21:45:27.308 UTC for 45.191 seconds, zero writes, DTR/RTS
false, zero complete/partial lines. Healthy diagnostics overlapped this quiet
serial window. Silence is not classified as a hang. The separate timestamped
serial JSON is retained in this folder.

## What remains

- Watch-only phase during a supervised powered walk, then a separately labeled
  phase with five-second polling plus the watcher; preserve pre/post failure data.
- Observe whether the browser reconnects without pairing/reloading after a forced
  close. No failure was induced or reproduced here, so this answer is **unknown**.
- Owner confirmation of floor placement/power/path before any movement. The last
  confirmed state remains bench/power off.
- XB10 actual Wi-Fi security mode still unknown; admin page requires login. No
  router setting was changed. USB vs board power and screen state must be recorded
  for the eventual floor run; cable/power changes can alter the failure conditions.
