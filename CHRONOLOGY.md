# GrowBot integration and testing — chronological guide for Brit

**Last updated: 29 September 2026.** Read this first for the sequence and current results; follow the linked reports for raw evidence and individual trials. Dates below are report/test dates, not a claim that every change was published upstream that day.

## Latest update — 29 September

**Brit's upright-phone tilt fix is live and the owner confirms it worked: neither walking nor the observed head movements triggered the false-tip response.** The phone is running `/v3/next.html`; inspection confirmed the upstream vertical-vector calculation and absence of our temporary tilt patch. This is not a claim that the separate Pico connection problem is fixed.

New material is in [September 29 report and sanitized logs](reports/2026-09-29-upstream-tilt/README.md). It also records two separate findings: incorrect screen-backward body instructions, and possible causes of preliminary leg movement before the stride. A later same-day [body-direction repair](prototype/body-direction/README.md) now corrects the effective model instructions in the live session; it is not a gait reversal or a permanent website change.

## Status at a glance

| Area | Latest supported result |
| --- | --- |
| Upright-phone false-tip abort | Upstream fix running; owner observed walking and head movement without false triggering on September 29. Extreme head angles were not measured/tested. |
| Stationary face tracking and deliberate-look priority | Physically confirmed on the bench; face returns resume tracking, expiry holds the head, and a deliberate look is not immediately overridden. Operator-selected handoff, not proof of autonomous model selection. |
| Silent model-selected head actions | Corrected local prototype passed both directions with servo power off. Powered model-selected handoff remains unverified. |
| Walking combined with tracking/attention | Not yet established by a complete powered combined test. |
| Pico connection recovery | Unresolved. Reopening the phone socket did not restore Pico replies in the reproduced failure window. |
| Forward/backward wording | Configurable Standard GrowBot/OwlBot/Custom body and direction selector installed; OwlBot/screen-forward selected. Five isolated model checks passed. Selection saves locally; reload removes the prototype hook/UI until reinstalled. |
| Preliminary leg movement | App startup poses and local firmware transition logic identified as candidate causes. Exact installed implementation and physical cause not yet proven. |

## September 21 — connection evidence and failure reproduction

**Question:** Why does the controller stop answering during walking, and does closing a stale phone socket restore it?

- Published the reviewed custom-firmware host snapshot, provenance, exact retained diffs and sanitized connection evidence. This is our adaptation, not stock GrowBot firmware or a fresh chip dump.
- Confirmed the five-second heartbeat is an application JSON `ack` in a WebSocket text frame. A separate WebSocket ping exists; the two must not be confused.
- During the later floor exploration, the stale-socket watcher forced closes and GrowBot opened replacement phone sockets without re-pairing. Pico replies did **not** return during the recovery window.
- The app reported a completed walk although the owner observed the body stopped mid-stride. Reconnection and truthful physical-completion reporting are separate problems.
- Communication later returned on a different boot. The reset trigger was not established; neither brownout nor a firmware/network cause was proven.

**Evidence:** [Initial report](evidence/READ-ME-FIRST.md) · [Walking failure report](reports/2026-09-21-walking-test/README.md) · [Movement-by-movement ledger](reports/2026-09-21-walking-test/appendices/01-movement-attempts.md)

## September 23 — document the eight-servo integration

**Question:** How do GrowBot's existing commands operate this different body without changing the website?

- Documented the Pico 2 W/Waveshare setup and the version last verified on September 22: custom `owlbot-pico-7.15`. The retained source snapshots are versioned historical evidence, not a continuously updated image of the board.
- Ordinary `walk` streams virtual two-leg `pose` frames. The Pico recognizes the alternating pattern and runs the saved four-leg/slide gait locally.
- Seven exact saved-gesture marker sequences carry turn left/right and head left/right/up/down/ahead through `act` packets. The Pico decodes those markers into calibrated body/head actions rather than treating them as literal leg poses.
- Listed required local configuration files and a sanitized setup route. Credentials and creature memories are not needed to share this mapping.

**Evidence:** [Integration note, gesture definitions and setup](INTEGRATION-NOTE.md)

## September 23 — stationary tracking, natural attention and head pacing

**Question:** Can the head follow a face while leaving the body still and preserving deliberate looks?

- Built a temporary browser prototype using the selfie camera and calibrated head-control lane. The first pan direction was wrong; reversing that axis produced owner-confirmed horizontal following. Vertical following was also confirmed.
- Added on-demand, silent tracking. Re-centering a tilt axis near its travel boundary improved vertical following. The owner confirmed tracking with no leg motion.
- An optional natural-attention trial followed the owner without a spoken tracking request; legs stayed still. A separate head-forward command centered comfortably. These were stationary checks, not a walking handoff.
- A short rightward look stopped early when its head-control lease expired. Added status keepalives and commanded-target verification; a controller target is not physical position feedback.
- Documented a read-back-verified firmware speed trial from 150 to 200 microseconds/second with servo power off. Later September 24 handoff work used the separately identified 400-speed implementation; the earlier 200-speed report must not be read as the latest installed speed.

**Evidence:** [Bench observations](prototype/face-tracking/BENCH-TEST.md) · [Speed-trial provenance](prototype/face-tracking/FIRMWARE-SPEED-TRIAL.md) · [Prototype scope and controls](prototype/face-tracking/README.md)

## September 23–24 — behavior handoff, disappearance and expiry

**Question:** Does tracking yield when GrowBot deliberately looks elsewhere, and what happens when a face disappears or the tracking window ends?

- Initial tests were interrupted by loose head hardware and then controller ACK timeouts. Those trials are retained as incomplete, not relabeled as successful.
- Found that one missed ACK stopped tracking permanently, so a returning face could not resume it. Prototype `stationary-0.5` added bounded read-only recovery without replaying an uncertain movement or reclaiming a deliberately yielded head.
- Successful powered bench repeats confirmed physical tracking, normal expiry followed by holding, and two face disappearances/returns with following resumed. No new tracking targets were issued during absent-face samples; legs stayed still.
- The owner confirmed tracking → deliberate look left → holding left even after returning in front. The deliberate look used the ordinary saved-gesture path but was selected by the operator, not autonomously by the model.
- Recovery after an actual missing ACK remains offline-tested only. Combined walking/tracking and powered model-selected arbitration remain separate checks.

**Evidence:** [Complete handoff ledger and result table](prototype/face-tracking/HANDOFF-TEST.md)

## September 24 — spoken motion claims versus actual dispatch

**Question:** Why could GrowBot describe a head movement without moving?

- Floor conversation produced head-movement promises without observed movement requests. The raw replies were not captured at the parser boundary, so their precise cause is unknown.
- A separate two-second native walk completed and the owner confirmed physical forward travel. It did not establish a successful look-then-walk handoff.
- Power-off diagnostics reproduced two local integration defects: action-only JSON needed an explicit `say:""`, and the asynchronous quick-look adapter reported acceptance too late for the host's immediate dispatch check.
- Prototype `stationary-0.6` corrected the guide and synchronously reported queued admission, followed by commanded completion or a real failure. Both model-selected head directions passed the power-off retest; a link interruption was accurately reported as failure.

**Evidence:** [Dispatch investigation, repairs and test limits](prototype/face-tracking/ACTION-DISPATCH-TEST.md)

## September 24 — identify and temporarily correct false tipping

**Question:** Why does an upright robot stop and say it tipped over?

- Original ten-second requests aborted after approximately 1.94 and 0.59 seconds with reported tilt of 81 and 178 degrees, although the owner said the robot remained upright.
- Independent orientation-component differences could jump near the phone's upright position. A session-only patch used the angle between phone-vertical vectors instead, retaining the existing threshold and jolt/stop handling.
- A normal conversational request then produced a 10.035-second walk. The owner confirmed a full physical walk, upright posture and normal stop. On the same captured sensor samples, the original calculation would have triggered its stop; the corrected maximum was approximately 7.32 degrees.
- The observed battery-input display dip was clarified as 8.0 to 7.9 volts, not 8 to 7. This was not a synchronized servo-rail or Pico supply measurement and does not prove or rule out brownout.

**Evidence:** [False-tip report and paired readings](reports/2026-09-24-false-tip/README.md) · [Historical temporary correction](prototype/tilt-guard/README.md)

**Superseded on September 29:** the temporary correction is no longer the active fix. Brit's upstream implementation is running instead. Historical files describing the patch as installed refer to the earlier browser session.

## September 29 — upstream fix confirmed and follow-up findings

**Question:** Is Brit's shipped upright-phone fix active, and did it work without our temporary patch?

- The owner reported reopening the updated GrowBot. Read-only inspection of `/v3/next.html` found the live gait function matched the loaded upstream source and used `phoneTiltDegrees`; our temporary tilt-guard object was absent. The exact upstream Git commit is unknown; function hashes are recorded.
- An earlier observed app event sequence recorded a 120.008-second forward walk ending normally, not with a tilt abort. The owner reported forward travel, but did not independently time every second or measure the distance.
- **Owner's final confirmation: the fix worked; neither walking nor head movement caused false triggering in the observed test.** Exact head angles were not measured, so large-angle head-versus-chassis behavior remains unverified.
- Published the current sanitized 240-event rolling log. The earlier walk had already rolled out, so its previously observed event excerpt is supplied separately and explicitly labeled—not presented as a recovered full-session log.
- The Brain-settings log-copy feature creates a private watch link. That credential-bearing link was deliberately not published; Brit can request it privately if the full upstream archive is required.
- Documented the screen-backward guide mismatch and 1.2-second neutral startup poses. Local firmware maps neutral to feet-Down and initially interprets leg poses before recognizing the walk pattern; these are candidate explanations for pre-stride leg movement, not verified historical servo-output measurements.

**Evidence:** [Latest report](reports/2026-09-29-upstream-tilt/README.md) · [Sanitized current log](reports/2026-09-29-upstream-tilt/current-log.sanitized.json) · [Earlier walk excerpt](reports/2026-09-29-upstream-tilt/earlier-walk-observed-excerpt.json)

## September 29, later follow-up — fix backward-walking instructions

- Rechecked the active page: the standard movement contract and official-gait label both claimed screen-backward travel. The editable guide was regenerated at startup, so a text-box-only change would not be durable.
- Installed a narrow session adapter correcting the effective movement guide for the owner-confirmed body. At the owner's request, expanded it into a switchable setting: Standard GrowBot (exact original guide), OwlBot eight-servo, or Custom body, with screen-forward/backward/unknown travel. Selected OwlBot/screen-forward for this robot. `official/fwd` still means forward; gaze/head pose and camera choice are not chassis travel direction. No motor, firmware, calibration, sensor or identity changes were made.
- Offline regression tests and live read-back passed. An isolated configured-model check passed all five direction/physical-evidence questions without dispatching a movement or speaking its reply. No new physical walk was run.
- The selection saves in a separate local per-body-ID preference; actual settings controls were tested and the original guide restored exactly when selected. **Reload removes this local adapter/UI, not the saved selection; reinstall reads it back.** The published implementation and integration recommendation show Brit how the setting should be integrated permanently upstream.

**Evidence and implementation:** [Body-direction repair](prototype/body-direction/README.md)

## What remains to investigate

1. Correlate an actual Pico reply loss with uptime, transport faults and supply measurements; phone-socket recovery alone is not a controller fix.
2. Verify model-selected head actions physically, then the combined head-forward/walk or tracking/walk handoff. Keep these distinct from the completed stationary command-path tests.
3. Make the now-tested body-direction description persistent upstream; the local session repair disappears on reload. Verify future natural conversation without reversing the physically correct gait.
4. Capture an owner-initiated walk's startup packets and controller transition alongside observed leg motion to isolate the preliminary repositioning.
5. Check articulated-head angles separately from chassis tipping if false positives recur or the operating head range expands.

This guide summarizes the documented work; the later body-direction entry includes a live session-only prompt repair. Older logs, manifests and detailed trial records remain unchanged. ACKs and commanded positions are software evidence; physical results are labeled as owner observations.
