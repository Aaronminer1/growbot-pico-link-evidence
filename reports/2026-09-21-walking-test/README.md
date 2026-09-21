# GrowBot walking, controller drop and recovery test report

Prepared for Brit from the owner-supervised test on **21 September 2026**.

## The answer to your two tests

**We reproduced the loss of Pico communication during a native-agent walk. Your
watcher detected the stale OPEN socket, forced it closed, and the app opened
replacement sockets without a pairing prompt or page reload. However, Pico
heartbeats and diagnostic replies did not return during the recovery observation.**

That is your second outcome: phone-side redial worked, but closing the stale
socket alone did not restore end-to-end controller communication in this test.
The owner confirmed the robot was physically stuck mid-stride and had not been
touched, reset, re-paired or had power changed at the failure.

Later, after the owner connected USB first and then removed main power, diagnostics
returned on a different firmware boot. We did not observe the exact reset or
reconnection moment. This later result must not be called immediate recovery from
the stale-socket fix, nor a confirmed deliberate full power cycle.

## Read the complete record

This report separates **attempted**, **software-completed**, **refused**, and
**physically observed** actions. It includes every retained event, not a claim
that unrecorded movement or every individual servo position was measured.

| Appendix | Contents |
| --- | --- |
| [01 — Movement attempts](appendices/01-movement-attempts.md) | All 32 captured action lifecycles: request, acceptance, start, completion, refusal or cancellation; per-event references. |
| [02 — GrowBot replies](appendices/02-growbot-replies.md) | All 104 retained thinking/reply events, short speech excerpts, image counts, moved field and available parser status. |
| [03 — Pico diagnostics](appendices/03-pico-diagnostics.md) | All 283 diagnostic results: uptime, reset cause, memory, RSSI, failures, connections, radio resets, heartbeats, pings and retained faults. |
| [04 — Connections and heartbeats](appendices/04-connections-and-heartbeats.md) | Every other socket-probe row: requests, phone state, heartbeats, stale closes, open/close events and operator marks. |
| [05 — Native event ledger](appendices/05-native-event-ledger.md) | All 566 deduplicated native events, including voice outcomes, parser metadata and movement guards, with exact source-array positions. |
| [06 — Pico gait and serial](appendices/06-pico-gait-and-serial.md) | Seven passive pre-failure gait observations and both passive serial windows. |
| [07 — Prompts and owner observations](appendices/07-test-prompts-and-owner-observations.md) | Exact saved coaching prompts and send times, manual-instruction summaries and physical observations. |
| [08 — Evidence inventory](appendices/08-evidence-inventory.md) | Original sanitized evidence files, byte sizes and SHA-256 hashes. |

Machine-readable equivalents are provided beside the appendices. Original capture
files are copied unchanged into `evidence/`. The index above is the current account;
older per-phase notes describe what was known at that earlier point.

## Conditions, controls and limits

- Robot: owner's Pico/Waveshare body, firmware diagnostic label
  `owlbot-pico-7.14`. Earlier hardware identification was Pico 2 W; USB later
  enumerated on COM5. This test did not freshly dump main.py, verify its byte hash
  on-chip, or visually re-audit the physical wiring. The earlier source/provenance
  package remains separate from this runtime report.
- Brain: native GrowBot page, model `glm-5.3-flash:cloud` through the existing
  tower bridge. The custom-provider route's “local” label does not mean this model
  ran locally. Saved JSON and vision flags were both enabled during inspection.
- Camera: live video was verified. Most recorded thoughts used three images;
  one early reply immediately after waking had zero frames, and a later tick
  had one. Do not call every move camera-validated or infer measured depth.
- Native agent chose actions in response to conversational encouragement. The
  sustained reproduction used no direct motor/gait calls. An earlier separate
  six-second direct native-gait check is documented below, not mixed into the
  agent's action totals.
- Floor main power came through the Waveshare board; Pico USB was absent during
  the reproduced failure. Exact supply voltage/current and rail sharing were not
  measured. Router: Xfinity XB10; security mode/band steering still unknown.
- The page remained visible and awake during the reproduced failure. Screen-lock
  behavior was not tested. There were no host debugging gaps in that main capture.
- No Pico REPL, flashing, firmware edits, reset command, network-setting change,
  page reload or re-pairing was performed during the reproduction/recovery windows.
- Instrumentation used additive listeners and native retry behavior. The watcher
  closed stale sockets; it did not replace onmessage/onclose. Five-second polling
  adds traffic and allocations, so watch-only and polled phases are labeled
  separately. The six probe host tests check instrumentation, not physical recovery.

## Phase-by-phase results

All times are **UTC** on 2026-09-21. Subtract seven hours for the owner's Pacific
daylight time. The reproduced loss begins around **3:28 PM PDT**.

| Phase | Start–end UTC | Diagnostic ACKs | Missed results | Forced closes | Interpretation |
| --- | --- | ---: | ---: | ---: | --- |
| Bench idle | 21:45:17.795–21:46:02.796 | 9 | 0 | 0 | Main/servo power off; one additional waiter cancelled at capture expiry, not a failed ACK. |
| Early floor watch-only | 21:50:05.870–21:51:35.870 | Not polled | — | 0 | Included a direct native six-second gait check; software completion reported. |
| Native exploration, watch-only | 21:54:48.146–21:58:02.457 | Not polled | — | 0 | No failure reproduced. |
| Native exploration, polled | 21:58:16.401–22:01:16.402 | 36 | 0 | 0 | No failure; action-selection stalls observed. |
| More active exploration | 22:08:10.270–22:14:10.271 | 72 | 0 | 0 | More native walks/turns; parser failures and two action-generation refusals recorded. |
| Sustained reproduction | 22:19:07.853–22:29:07.854 | 107 | 13 | 2 | Loss of Pico replies during a walk; replacement phone socket did not restore replies. |
| Post-drop recovery observation | 22:29:29.381–22:32:29.382 | 0 | 36 | 5 | Repeated new sockets, no Pico heartbeat or diagnostic ACK. |
| Later USB bench observation | 22:38:33.123–22:39:18.124 | 9 | 0 | Disabled | Different boot, reset cause 3, five current-boot Wi-Fi association failures before connecting. |

Total: **233 successful diagnostic replies, 49 misses, and one cleanup-cancelled
request**. There is a **21.527-second probe gap** between sustained and recovery
captures, plus other explicitly separated phase gaps. No close event is inferred
inside those gaps. Native snapshots retained some actions between main socket
capture windows; the action appendix includes them without implying continuous
socket coverage.

## What GrowBot actually attempted

Across retained native records: **32 movement attempts**—30 software-completed,
one blocked and one superseded/cancelled. These are **not 30 physically verified
successes**. The completed count includes a known physical mid-stride failure.

- 18 forward walks reached a recorded start; 17 have recorded walk_end events.
  One was superseded by another walk. The backward attempt was blocked.
- 13 gesture attempts reached software completion. Names were retained for some
  turns/head gestures; unknown names remain unknown rather than inferred from speech.
- The owner verified real walking and turning in the room, then intermittent
  movement and eventually the stuck mid-stride condition. Individual distances,
  stride completeness, servo positions and motor currents were not measured.
- Speech repeatedly claimed a turn or walk with `moved: still`. Some such replies
  failed parsing; others were action-refused or simply had no recorded new action.
  A prior movement can overlap a `still` reply, so it is not itself proof that
  every motor was stationary.

### Every recorded explicit refusal or supersession

| UTC | Event | Recorded outcome |
| --- | --- | --- |
| 21:57:31.318 | A007, walk:back | blocked / not_admitted; no physical backward travel established. |
| 22:09:25.963 | A012, walk:fwd | cancelled / superseded as A013 was accepted. This is not a transport failure. |
| 22:09:35.733 | In-flight next action | motion_refused / stopped, w=1, just after a normal walk completion. No new action lifecycle was created. |
| 22:12:42.714 | In-flight next action | motion_refused / stopped, w=0, just after another normal walk completion. |
| 22:28:07.352 | A031, walk:fwd | Software says completed/done; owner reports physical stop mid-stride during the loss of replies. |

All other software-completed movement lifecycles are listed individually in
Appendix 01, including later between-window actions and the post-drop head
gesture A032. A032's command window completed while Pico diagnostics were absent;
that is not evidence the head physically moved.

## Reproduced failure: precise timeline

| UTC | Evidence |
| --- | --- |
| 22:27:57.988 | Last diagnostic ACK: uptime 2,336,599 ms; free memory 134,304 B; RSSI -73 dBm; latency 135 ms. |
| 22:27:58.094 | A031 forward walk requested and accepted. |
| 22:27:59.316 | Native gait loop starts its requested eight seconds. |
| 22:28:02.853 | First unanswered dog_info is sent. |
| 22:28:04.863 | Last Pico heartbeat received, uptime 2,342,239 ms. |
| 22:28:06.855 | First four-second diagnostic timeout. |
| 22:28:07.352 | App reports walk completed after 8,036 ms, despite lost diagnostic response and the owner's physical mid-stride failure. |
| 22:28:08.687 | Coaching helper stops further prompts on the first failed diagnostic. |
| 22:28:25.853 | Brit-style watcher forces close: STALE 20,990 ms on an OPEN socket. |
| 22:28:35.955 | Browser close event code=1006, clean=false. |
| 22:28:37.853 | App has a replacement OPEN socket without user pairing/reload. Ready/awake indicators return, but no diagnostic ACK follows. |
| 22:28:58.853 | Replacement goes stale; second forced close. |
| Through 22:32:29.382 | Further native redials and forced closes; no Pico heartbeat/diagnostic recovery in the recorded window. |
| 22:34:35.360 | GrowBot paused for the owner to handle/move it after the recovery test ended. No chip reset issued by the assistant. |

The owner later explicitly stated that nothing was touched or changed at the
failure. We did not measure the exact millisecond at which physical legs stopped.

### Exact decisive console lines

```text
[gb-stale] 2026-09-21T22:28:25.853Z STALE 20990ms on an OPEN socket, forcing close #1
[gb-stale] 2026-09-21T22:28:35.955Z close code=1006 clean=false
[gb-stale] 2026-09-21T22:28:37.853Z watching new socket, readyState=1
[gb-stale] 2026-09-21T22:28:58.853Z STALE 21000ms on an OPEN socket, forcing close #2
```

Appendix 04 retains every captured console line, including the later retries.
Code 1006 is an observed abnormal-close result after the forced close, not an
upstream relay close reason that identifies the original fault. Seven forced
closes were recorded across both windows; six corresponding close events were
captured, all 1006/unclean. One close fell outside continuous probe coverage and
is not assigned a code. Counter/socket numbering restarts per capture.

## Pico observations and what they do not prove

Immediately before the failure, counters remained failures=3, connections=1,
radio_resets=4. The fault ring still held the three boot-time Wi-Fi association
failures at uptimes 17,949, 36,451 and 56,952 ms. There was no retrieved new fault
entry after telemetry stopped on that boot.

The last seven memory readings were 73,184 → 28,608 → 311,504 → 267,008 →
222,944 → 178,448 → 134,304 bytes. Their RSSI readings were -74 or -73 dBm.
Across the main reproduction window, memory ranged 320–318,480 bytes and RSSI
-77 to -68 dBm. The lowest free-memory reading was **not** the final reading.
The recovery after low readings is compatible with garbage collection, not proof
of either a leak or the absence of future allocation failure. No MemoryError was
captured. These five-second samples do not exclude a later power or RF transient.

Passive gait observations ended before A031 began: idle, old stop reason
`support_pattern_timeout`, three completed cycles and 27 phases from earlier
activity. No new gait sample arrived during A031. Assigning that old stop reason
to this communication failure would be incorrect.

No powered-floor serial stream was available. The two passive bench serial
windows were both quiet, with zero writes and DTR/RTS false. Silence is not a hang
classification, and these are not serial recordings across the floor failure.

## Later USB connection and reboot evidence

The owner connected **USB first, then removed main power**. This was not an
intentionally unpowered interval. Actual electrical continuity during transfer
was not measured. The overlap was contrary to [Waveshare's published power
guidance](https://www.waveshare.com/wiki/Pico-Servo-Driver#FAQ); main power was
subsequently confirmed disconnected. This later handling cannot explain the
original drop, which occurred while the owner confirmed nothing had been touched.

The new boot answered nine of nine checks: first uptime 283,228 ms at
22:38:33.256 UTC, reset_cause=3, RSSI -71 dBm. Counters were failures=5,
connections=1, radio_resets=6; the latest four fault entries were Wi-Fi association
failures at 36,452, 56,953, 82,921 and 115,422 ms of this boot. The first of the
five entries had aged out of the four-entry ring; its details are unknown.

In [MicroPython v1.28.0 RP2 source](https://github.com/micropython/micropython/blob/v1.28.0/ports/rp2/modmachine.c),
reset cause 3 is WDT_RESET, and `machine.reset()` also uses the watchdog reboot
mechanism. The host firmware contains a deliberate restart after repeated
network failures. Consequently, code 3 alone does **not** prove watchdog expiry
or distinguish it from software self-healing. Approximate main.py boot-reference
time is 22:33:50 UTC, inferred from host receipt minus uptime, not an exact
electrical power-on timestamp. The reset trigger and exact recovery moment remain
unknown; no serial boot banner was captured live.

## Separate app/model findings

These help explain intermittent nonmovement but do not replace the reproduced
controller communication fault:

1. **Structured-response failures.** Of 104 reply-status events, 72 retained a
   parsed flag: 42 were false and 30 true; 32 lack that field. Completed transport
   and spoken movement promises sometimes yielded no executable action. An
   explicit JSON-action reminder restored movement on individual turns. Raw
   model output was not captured, so model, bridge streaming and parser ownership
   are not yet isolated. No broad model failure rate is inferred from these samples.
2. **Normal completion versus cancellation.** Read-only live-code inspection found
   that `think` snapshots `_motionGen`, normal gait completion calls
   `carryLegMotion()` which increments it, and a subsequently arriving movement
   intent can then be rejected as `stopped`. Two logged sequences match this
   race. Distinguish genuine user cancellation from normal completion in review;
   do not remove the protections for pause or a newer command.
3. **Narration and physical completion disagree.** Speech can survive parsing or
   execution refusal, and browser timers can report completion without physical
   feedback. A031 is the directly owner-confirmed counterexample. A relay
   ready/awake indication alone also did not prove end-to-end Pico liveness.

No website or firmware changes were made to address these findings during this
test. Instrumentation and local report-generation scripts are separate.

## Recommended next investigation for Brit

- Correlate relay connect/close/routing logs with the UTC failure timeline and
  establish whether replacement phone sockets reached a live chip session.
- Preserve Pico-originated liveness separately from relay presence; distinguish
  “phone socket reopened” from “controller command/reply recovered.”
- Investigate why the chip stops replying and why later association requires
  multiple attempts. XB10 security mode is still unknown; do not assume WPA3 is
  the cause. Capture chip serial across another failure with a verified power-safe
  arrangement and measure rails under motion if examining brownout.
- Make incomplete/invalid action output and execution refusals visible to the
  agent without inventing completed motion; investigate the generation race.
- Retain post-reset cause/history in an explicitly designed future diagnostic
  build only after preserving this reproduced-failure package. No such firmware
  change was performed for this report.

## Completeness, provenance and privacy

Every retained native action outcome appears exactly once in the action ledger;
overlapping snapshots were deduplicated with source references and no conflicting
field values. Original app action IDs were not retained; report attempt IDs are
inferred from timestamp, action and lifecycle order. The raw event ledger makes
those associations auditable. Rolling page logs and phase gaps mean this cannot
be an exhaustive account of events that were never captured. The direct six-second
precheck has only the preserved contemporaneous summary and watcher marks, not
a full native-event stream, and is not silently added to the 32 inferred attempts.

The package contains sanitized diagnostics, test-generated robot excerpts and
coaching text, not full user transcripts, camera frames, Wi-Fi passwords, API
keys, pairing URLs, credentials or raw headers. Existing redactions are retained.
The source inventory provides byte hashes; MANIFEST.json covers the assembled
package. No repository was pushed or message sent to Brit as part of writing it.
