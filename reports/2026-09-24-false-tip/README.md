# False tipping during forward walking — 24 September 2026

## Result for Brit

**A session-only correction completed a ten-second native GrowBot forward walk, and Aaron confirmed a full physical walk, upright posture and a normal stop.** During that same walk, the original tilt calculation would have triggered its five-consecutive-sample stop; the corrected calculation remained below 7.4 degrees. This identifies a browser tilt-calculation problem distinct from the earlier controller-disconnection investigation.

This is one supervised floor trial, not a long-duration reliability result or a physical fall-protection certification. No firmware, calibration, gait speed, motor permission, identity or website file was changed for this trial.

## Original failures

Aaron reported that a requested ten-second forward walk repeatedly stopped with “I tipped over,” although the robot had not tipped. The live GrowBot diagnostic journal contained:

| Requested/granted walk | Time until abort | Reason | Reported tilt | Reported linear acceleration |
| --- | --- | --- | --- | --- |
| 10 / 10 seconds, official gait | 1.939 seconds | tipped | 81 degrees | 0 |
| 10 / 10 seconds, official gait | 0.593 seconds | tipped | 178 degrees | 0 |

The acceleration field is rounded by the app; zero is not proof of no motion. No historical raw orientation stream was retained for these two aborts. The owner's physical observation and the app events are separate evidence.

The live `_runGait` function, not the Pico or a generated model reply, supplies the abort and the hard-coded spoken claim:

```js
var dTilt = Math.max(angDelta(ori.b,upB.b), angDelta(ori.g,upB.g));
tipN = dTilt>55 ? tipN+1 : 0;
jerkN = lin>11 ? jerkN+1 : 0;
if (tipN>=5 || jerkN>=6) { /* original stop, cooldown and spoken reason */ }
```

The phone is mounted almost vertically on a movable pan/tilt head. Independent beta/gamma differences are not physical tilt. Near vertical, the Euler representation can change dramatically while the phone's vertical direction changes very little. Separately, deliberate head tilt is not necessarily a chassis fall.

## Correction and preserved behavior

The [session-only prototype](../../prototype/tilt-guard/README.md), version `vertical-vector-0.1`, replaces the angle expression in the native walk guard and its associated near-upright learning check. From the [W3C DeviceOrientation Z-X-Y convention](https://www.w3.org/TR/orientation-event/), it constructs:

```text
v(beta,gamma) = [-cos(beta)*sin(gamma), sin(beta), cos(beta)*cos(gamma)]
tilt = atan2(length(cross(v_now,v_start)), dot(v_now,v_start))
```

Heading is excluded: yaw alone is not tipping. Synthetic `(beta,gamma)=(89,-89)` to `(91,89)` yields an old result of 178 degrees but a vector difference of approximately 0.035 degrees. This example is a regression fixture, not an invented historical sensor reading.

The existing 55-degree / five-iteration stop, pickup/jolt detection, Stop, pause/visibility, duration and duty checks remain. Numeric invalid readings use the existing stop path rather than being interpreted as level. A completely absent orientation object still follows the original outer `if(ori)` behavior; sensor freshness is not newly solved here. The spoken reason now describes an unexpected phone angle rather than claiming a confirmed body fall.

No threshold was widened and no fall handling was removed. The prototype does not compensate for commanded head pitch, and does not patch the separate wheels `runDrive` path. Brit should review all relevant body paths for the permanent implementation.

## Powered floor test

The operator requested that GrowBot wake and walk forward for ten seconds. The test submitted a normal conversational request through the existing app, rather than sending gait packets directly. The model/native action route started the official forward gait. An in-memory observer captured numerical orientation readings and scoped walk events without extra Pico diagnostic polling during the stride.

| Measurement | Result |
| --- | --- |
| Requested / granted duration | 10 / 10 seconds |
| App completion | `walk_end`, `why:done`, `ms:10035`, holding |
| Recorded orientation samples | 253 |
| Largest original component-angle result | 160.8 degrees |
| Original five-consecutive-sample stop would fire | Yes, calculated in shadow only |
| Largest corrected vertical-vector angle | 7.323926 degrees |
| Invalid numeric samples | 0 |
| Tilt abort in corrected trial | None |
| Owner's physical confirmation | Full walk, upright, normal stop |

The same sensor samples produce both results: this is not an A/B comparison with a different walk. It demonstrates the false-positive calculation during a successful physical walk. Controller ACK/completion alone would not establish physical success; the owner confirmed it separately. No instrumented/synchronized voltage trace, new serial capture, physical fall or pickup test was performed. This trial does not establish a fix for historical Pico drops.

The prototype observer was removed after the trial; the correction remains installed in this browser session. Reload removes it. No upstream website change has been made. GrowBot was paused after the owner reported the voltage observation below; no further movement was requested.

### Owner-observed supply display drop

Aaron clarified that the robot's digital buck-converter display measures **battery input**, which fell from **8.0 V to 7.9 V during the walk** and recovered after the walk stopped. This corrects his initial report of 8 V to 7 V; the corrected observation is a 0.1 V displayed input dip, not a 1 V servo-output dip. Display accuracy/update rate and minimum instantaneous voltage are unknown. This is an owner-observed display reading, not a synchronized electrical capture. It does not establish Pico brownout, reset, or a causal link to historical disconnects, and cannot rule out brief downstream rail dips. These numbers do not describe Pico VSYS or the servo rail.

## Setup and provenance

- App: live `https://growbot.dev/`, inspected 24 September 2026. Exact deployed upstream commit/build identifier: **unknown**. The installer checks the observed function shape and original guard strings, rejecting unexpected source changes.
- Hardware: custom eight-servo body, phone on pan/tilt head. Previously established MG90S head and DS3225MG body servos; this trial did not re-inspect wiring.
- Pico: previously observed MicroPython 1.29.0 and custom app label 7.15, with later custom modules. Exact current whole-device source hash: **not re-read in this trial**. Historical repository snapshots must not be treated as a fresh installed firmware image.
- Existing local face/head and body-tool session adapters were present; no additional body-tool feature or firmware is being published as part of this report. This correction targets the native forward `_runGait` path.

## Evidence and verification

- [Sanitized paired numeric readings and walk lifecycle](trial.json)
- [Integrity manifest](SHA256-MANIFEST.json)
- [Offline verifier](verify.cjs): `node reports/2026-09-24-false-tip/verify.cjs`
- [Correction regression tests](../../prototype/tilt-guard/test.cjs): `node prototype/tilt-guard/test.cjs`
- [Installation, limitations and rollback](../../prototype/tilt-guard/README.md)

The evidence uses an explicit field allowlist: timestamps, angle/acceleration numbers, scoped movement lifecycle, and a normalized owner result. No camera frames, audio, conversation history, creature memories, keys, pairing codes, Wi-Fi passwords, device identifiers or private endpoints are included. Only this new report, correction code and index link are in this publication; historical evidence remains unchanged.

## Suggested upstream follow-up

1. Replace independent Euler-component differences with a geometrically valid tilt measure in applicable movement paths.
2. Separate phone/head attitude from chassis fall claims; use body-specific mount/pose knowledge where available.
3. Retain direct Stop and real-tilt handling, add source tests around near-vertical representation changes, and explicitly define missing/stale sensor behavior.
4. Log the measured attitude change and exact stop reason; avoid announcing a confirmed fall without corroboration.

For this eight-servo build the limited correction is experimentally successful. Longer walking, deliberate head movement while walking, pickup behavior and genuine tipping response remain separate validation tasks.
