# Reproduced controller communication loss during native GrowBot walking

2026-09-21. UTC timestamps below; local time is Pacific daylight time (UTC-7).

## Outcome for Brit

**Your watcher logged STALE, forced the phone WebSocket closed, and the app opened
replacement sockets without pairing or reloading. But Pico heartbeats and dog_info
ACKs did NOT return during the observation window.** This is your second outcome:
closing the stale phone socket alone did not restore end-to-end communication.
It does not establish whether the remaining failure is on the chip, relay,
network or power path. No post-drop uptime/fault sample arrived within the initial
recovery-observation windows.

**Later follow-up:** after this measured recovery window ended, the owner moved
to a USB-powered bench setup and diagnostics resumed on a different boot. See
USB-BENCH-FOLLOWUP.md. Owner confirmed USB-first/main-power-off-second, not an
intentional all-power interruption. The later reset_cause=3 does not distinguish
watchdog expiry from the firmware's deliberate machine.reset self-heal path.
The lack of immediate post-drop telemetry still leaves the failure trigger unknown.

The separate 180-second post-drop window finished at 22:32:29.381 UTC with
zero successful diagnostics, 36 missed diagnostics and five further forced
closes. Observed close events in that window were code 1006, clean=false.
There were no Pico heartbeats in that window. The owner then requested moving
the robot to the bench; GrowBot was paused AFTER the completed observation
windows, not as a recovery intervention during them. No chip reset was issued.

The owner confirmed actual walking and turning around the room earlier in the
run, then intermittent movement, and finally a physical stop mid-stride. The owner
explicitly confirmed no touching, reset, power change or reconnect action at the
failure. The browser nevertheless recorded the last eight-second walk as
`completed/done`. That browser timer is not proof of completed physical gait.

## Conditions

- Normal GrowBot agent controlled the body through native conversations and its
  existing movement executor. No direct gait calls or firmware actions in this run.
- Native coaching encouraged exploration and valid JSON action fields whenever
  the agent was idle. It sent no motor packets directly and stopped automatically
  at the first missed diagnostic at 22:28:08.687. Autonomous app replies could
  still occur afterward; do not claim all outgoing app activity stopped then.
- Agent stayed awake and page-visible throughout the failure and recovery test.
  No screen-lock test, navigation, re-pairing or manual reset.
- Phone debugging remained connected: zero host debugging gaps in the main run.
- Pico USB was absent. No serial/REPL capture, no firmware read/write or flashing.
- Existing five-second read-only dog_info polling; additive stale watcher closes
  an OPEN socket after over 20 seconds without incoming messages. Existing
  onmessage/onclose handlers and native retry logic were not replaced.
- Pico owner-reported power: through the Waveshare board. Rail voltage, current
  and physical supply condition at failure were not measured.
- Router is Xfinity XB10. WPA2/WPA3/transition mode remains unknown and unchanged.

## Timeline

| UTC time | Observation |
| --- | --- |
| 22:19:07.853 | Main sustained capture starts, watcher plus 5 s polling. |
| 22:27:57.988 | Last successful dog_info: uptime 2,336,599 ms, free memory 134,304 B, RSSI -73 dBm, reply latency 135 ms. |
| 22:27:58.094 | Native forward-walk action requested/accepted. |
| 22:27:59.316 | Browser gait loop reports walk_start, requested duration 8 s. |
| 22:28:02.853 | First unanswered dog_info request sent. |
| 22:28:04.863 | Last received Pico heartbeat: uptime 2,342,239 ms. |
| 22:28:06.855 | First diagnostic timeout (4,002 ms). |
| 22:28:07.352 | Browser reports walk completed/done after 8,036 ms despite missing diagnostic reply. Owner reports physical stop mid-stride, precise physical stop time not measured. |
| 22:28:08.687 | Coaching helper stops new prompts on diagnostic failure. |
| 22:28:25.853 | STALE 20,990 ms on an OPEN socket; watcher forces close #1. |
| 22:28:35.955 | Close event: code=1006, clean=false. This is browser-observed abnormal closure, not a relay-supplied explanation of root cause. |
| 22:28:37.853 | Native app has replacement OPEN socket; ready/awake indicators become positive. No Pico diagnostic ACK follows. |
| 22:28:58.853 | Replacement is also stale; force close #2. |
| 22:29:07.853 | Main finite probe expires; saved 107 successful and 13 missed diagnostics, 2 forced closes. |
| 22:29:29.381 | Separate 180 s post-drop capture begins; same polling/watcher, no new movement prompts. |
| 22:32:17.731 | Owner's untouched/stuck-mid-stride confirmation marked in capture; no end-to-end recovery yet. |

The two probe windows have a roughly 21.5-second instrumentation gap, clearly
labeled; do not infer close codes/events during that gap. The page was not
reloaded and no manual recovery action occurred. Per-probe socket IDs and forced
close counts restart, so they are not globally unique across files.

## Before-failure telemetry

In the main run the last known counters remained failures=3, connections=1,
radio_resets=4; last heartbeat counter=450, ping counter=226. All three retained
fault entries were preexisting boot-time Wi-Fi association failures at uptimes
17,949 / 36,451 / 56,952 ms. No new fault-ring entry was retrieved after the drop.

| Last seven successful sample times | Free bytes | RSSI dBm |
| --- | ---: | ---: |
| 22:27:27.978 | 73,184 | -74 |
| 22:27:33.037 | 28,608 | -74 |
| 22:27:37.984 | 311,504 | -74 |
| 22:27:43.016 | 267,008 | -73 |
| 22:27:47.984 | 222,944 | -74 |
| 22:27:52.988 | 178,448 | -73 |
| 22:27:57.988 | 134,304 | -73 |

Whole main-run memory range was 320 to 318,480 bytes; RSSI -77 to -68 dBm.
The low memory sample was earlier, not the final sample. These readings do not
prove or rule out MemoryError, voltage sag or an RF interruption after the last
successful sample. Uptime was continuous until telemetry stopped; reboot versus
hang versus transport loss AFTER that point remains **unknown**.

## Movement evidence and limits

The incremental native trace contains four walk starts and four timer-completed
walk reports totaling 32.077 seconds, plus six started gestures in this 10-minute
main window. Do not describe this as ten minutes of continuous walking. Owner
confirmation establishes real movement earlier; it does not validate every
software completion. Parsing/action-selection stalls also occurred (see separate
ACTION-FLOW-FINDINGS.md), but they are not a substitute explanation for the
actual loss of Pico replies captured here.

A passive listener additionally extracted gait state from existing dog_info
replies without extra polls. It ended with an idle state and old
`support_pattern_timeout` reason BEFORE the final walk. No post-start gait sample
arrived. Therefore that old stop reason does NOT establish why this walk stopped.

## Artifacts

- `sustained-explore-repro-01-2026-09-21T22-19-06-585Z.json`: full diagnostic series, console lines, heartbeat/phone states and operator marks.
- `post-drop-recovery-01-*.json`: separate three-minute retry/recovery observation.
- `native-exploration-2026-09-21T22-19-18-187Z.json`: incrementally preserved native action reports and short robot test replies.
- `exploration-coaching-2026-09-21T22-20-24-467Z.json`: exact test prompts and helper stop on first missed diagnostic.
- `pico-gait-at-failure-*.json`: passive pre-failure gait status and native action timestamps, no raw model output.
- `action-parser-*.json`: parser/guard metadata snapshots. These overlap; deduplicate by timestamp/event, never sum snapshots.

## What is still needed

- Post-recovery uptime and new fault-ring entry, if the Pico recovers without
  resetting it; neither can be invented from source inspection.
- Chip-side passive serial across failure (not available on this untethered run)
  and Brit's relay logging to distinguish chip connection from stale relay presence.
- Actual servo/Pico rail measurements if investigating brownout, and actual XB10
  security setting if investigating association. No settings changed in this test.

All files remain local private evidence; no automatic public-repo update.
