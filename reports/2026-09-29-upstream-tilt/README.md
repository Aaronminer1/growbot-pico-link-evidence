# Follow-up to Brit's upright-phone tilt fix — September 29, 2026

## Current upstream fix is running; temporary patch is absent

The owner reports that GrowBot was reopened on the new version before this run. Read-only inspection of the active `/v3/next.html` page confirms:

- The live `_runGait` function matches the function in the loaded page's inline source.
- Its tipping calculation calls `phoneTiltDegrees(ori, upB)`, comparing phone-vertical vectors rather than independent Euler-angle differences.
- The existing threshold is still 55 degrees for five consecutive iterations; the pickup/jolt path remains separate.
- The previous session-only `GrowBotTiltGuard` object is absent. No temporary tilt patch was installed during this inspection.

This is source/runtime confirmation, not an exact upstream Git commit identification. Function SHA-256 hashes are in the log snapshot for reproducibility. We did not reload or interrupt the active run to collect evidence.

## Observed walking result and limits

The earlier observer read a forward walking attempt, action 24, with a 120-second request. The app logged startup preparation, then a 120,008 ms run ending with reason `done`, a completed action result, and a 60-second neutral hold. That recorded result was not a tilt abort. The owner described the robot as walking toward the door and reported physical forward travel, but did not separately confirm all 120 seconds or precise distance.

[Earlier observed walk events](earlier-walk-observed-excerpt.json) are transcribed from the structured diagnostic output captured during this same session. They are **not** a newly downloaded full original log or an independent physical-motion measurement. The original app timestamps and diagnostic fields are retained; omitted events are not reconstructed.

Owner follow-up after publication: **the fix worked in the observed test; neither head movement nor walking triggered the false-tip response.** This is the owner's physical observation, supplementing the app's recorded completion above. The precise head angles and movement range were not measured.

No additional walk or deliberate head-tilt trial was initiated by the observer for this report. As Brit noted, a phone riding on an articulated head can change angle without the chassis tipping. The reported test passed, including the head movements the owner observed; **large head-tilt behavior and head-versus-chassis compensation remain unverified.** This report must not be read as proof that every possible false-tip case is fixed.

## Log provided

[Current sanitized device log](current-log.sanitized.json) contains the 240 retained events at collection time, plus runtime/source checks. It is a direct read of the current in-memory diagnostic event buffer, not a button-generated full-session export. By collection time, the earlier walking attempt had already rolled out of that buffer; the current file therefore has no walk-start/end rows. That missing coverage is why the earlier observed excerpt is supplied separately.

The Brain settings **Copy brain logs** feature supplies a watch link, not a complete local log file. The watch page identifies its session ID as a credential and warns that anyone with the link can read the logs. We intentionally did **not** publish that link/session identifier. Brit can request that link privately from the owner if the upstream archive is needed to recover the earlier full sequence.

The exported JSON is allowlisted diagnostic data. It omits speech, user transcripts, creature identity/memory, session identifiers, URLs, pairing codes, keys, camera images and audio. Event timing, movement states, virtual-leg targets and numeric telemetry are retained where present. This is a sanitized diagnostic subset, not a verbatim export of every original field.

## Separate findings from the same run

### Incorrect body-direction instructions

The active guide and official-gait catalogue still describe the standard two-legged body's screen-backward travel convention. The owner's adapted eight-servo body physically travels screen-forward. Observed commands were `walk:fwd`, the walker's reverse flag was false, and the selfie camera was live. Saved head/turn gestures were present, but the standard direction text remained in the effective guide.

This is a body-description mismatch, not evidence that the gait should be electrically or mechanically reversed. Body-specific direction metadata needs to override the standard policy description.

### Leg movement before the walk

The owner reports the legs sometimes move before the stride starts. Live application source sends neutral virtual L/R poses for approximately 1.2 seconds before `walk_start`. Current offsets were zero, so its `pose` serializer produces `{"t":"pose","lr":"90,90"}` during preparation. Action 24's log shows a 1,204 ms interval from `stance_commands` to `walk_start`.

The **local host copy** of `stock_body.py` maps streamed neutral to saved feet-Down endpoints. It also initially maps virtual L/R values into leg positions until it recognizes two qualifying alternations and starts the coordinated gait. Either phase can explain preliminary leg repositioning. Installed firmware bytes and actual PWM outputs were not read during this powered run; this remains a source-backed candidate explanation, not a proven mechanical diagnosis.

A subsequent 20-second passive WebSocket observation captured four incoming ACKs and no outgoing movement packets while the app was idle. No new walk was started by the observer. Repeated loud-noise reflex log entries were also checked: the saved `loud`/`move` reflex had no steps, and the handler returns without issuing movement in that case. Those log entries alone are not servo commands.

## Changes made / not made

- Documentation and sanitized evidence only.
- No website edits, motion requests, firmware changes, calibration changes, policy changes, or identity edits.
- No controller reconnect/reset, app reload, or deliberate fall/head-tilt test.
- The historical September 24 prototype and evidence remain unchanged; they describe the earlier implementation, not the code currently running.

The next discriminating motion capture would span an owner-initiated normal walk, including startup packets and the Pico's transition into coordinated gait, with the owner reporting which leg motion occurs at each point. A later stationary head-only check can address the separate articulated-head caveat.
