# Stationary behavior handoff: 23–24 September 2026

## Scope and reading this ledger

This answers Brit's stationary-head handoff request for **GrowBot**, not OwlBot. Later entries supersede earlier pending-result notes; the unsuccessful trials are retained. Command acknowledgments and simulated tests are not physical position feedback. Deliberate saved looks in these powered bench trials are operator-selected through the normal gesture wire path, not model-selected choices. No combined walking/tracking result is claimed.

## Result summary for Brit

| Requested check | Result and scope |
| --- | --- |
| Establish stationary tracking | Owner confirmed physical following on version 0.5; legs still. |
| Deliberate look takes priority | Owner confirmed following → look left → held left on 0.5. Tracking target count remained unchanged after the look. This is the normal saved-gesture command path, selected by the operator. |
| Do not reclaim the head after a timer | Earlier 0.4 trial included 41 visible-face samples beyond the old yield deadline without new tracking targets. The 0.5 repeat also retained ownership through expiry, but post-turn face detection was absent; owner independently reported returning in front. |
| Face disappears and returns | 0.5: no new targets across 80 absent-face samples; two returns resumed targets and physical following, confirmed by owner. |
| Tracking window expires | Normal expiry observed on 0.5, with commanded motion stopped and support retained; owner confirmed physical following then holding. |
| Optional natural attention yields | Offline real-controller-logic test passes across repeated glance intervals; explicit tracking choice resumes. Not a new powered autonomous/model-selection test. |

**Stationary command-path checks are complete at the scope above.** Still unproven: model-selected behavior arbitration on powered hardware, recovery during an actual live tracking ACK outage, and walking combined with tracking. The controller connection is not declared fixed. No firmware or OwlBot changes were made in this verification. The report and prototype are being published to the Brit-facing evidence repository only; earlier entries saying “unpushed” describe their historical preparation stage.

## Changes under test

Session-only prototype `stationary-0.4` retains deliberate-look ownership until an explicit new face-tracking choice. Expiration of a suppression timer no longer reclaims the head. Delayed tracking acknowledgments cannot replace the recorded deliberate look. Face disappearance stops new tracking targets; expiry stops the tracker without force-releasing the mounted head. The last already-accepted short head target may finish; stop is not a physical brake.

The prototype accepts head speed up to 400 microseconds/second only with the owner's tested `head-speed-400-cadence-v2` implementation marker. Target lead remains capped at the previous 200-rate tuning. This changes the temporary browser prototype, not growbot.dev website code, saved robot configuration, identity, or memories. No firmware was changed for this handoff test.

Offline `test.cjs`, `test-controller.cjs`, and `test-handoff.cjs` pass. They cover persistent look ownership, explicit resume, face disappearance/reacquisition, expiry, stale tracking ACKs, speed-marker validation, and head-only centering while paused. These are software/controller simulations, not physical proof.

## Initial powered trial — physical result inconclusive

The owner confirmed the mounted robot stationary on the bench, servo power connected, GrowBot sleeping, then explicitly authorized camera/head-only bench mode. The selfie camera was opened without resuming thinking or autonomous legs. No images were saved; only face position and command state were read.

A 30-second trial issued one tracking target, then the operator helper sent the existing saved `look left` gesture. This was **not** a model-selected action. At 15.1 seconds, beyond the old 12-second yielding period, tracking command count remained 1 and deliberate ownership remained held. Tracking expired at 30.5 seconds without issuing another target. The final Pico report was pan 2100, tilt 848, moving false, holding true, body busy false; GrowBot remained paused. No leg or body-turn requests were sent by the test.

The owner then reported a hardware issue and requested a pause. Tracking and camera were stopped, full sleep restored, and no centering or head-release request was sent. The owner subsequently explained that two servo-horn screws had been missing and the head almost detached. Therefore this trial establishes command arbitration evidence only; it must **not** be described as a successful physical handoff or evidence of safe combined walking/tracking.

## Restart after hardware repair

The owner reported both missing screws fitted, the head tight, main power restored, and explicitly requested centering before testing resumed. A separate operator-only `center-bench` command kept GrowBot asleep and tracking off, checked the controller's idle body state and head limits, and sent only `dog_cal/head_move` followed by read-only head-info requests. Run 12 completed at commanded pan 1500 / tilt 855, with holding true. Physical centering and security await owner confirmation before the next tracking movement.

The bench remains a head-only test. OwlBot checks and walking/tracking combinations are not yet performed as part of this sequence. Changes and this report are local; they have not been committed or pushed to GitHub.

## Retry after second adjustment and physical centering confirmation

The owner reported another adjustment complete and power restored. Head-only centering run 13 reported pan 1500 / tilt 855, and the owner confirmed the head physically forward/level and the phone secure. A new 30-second stationary trial followed with thinking and legs paused.

At 0.409 seconds one face was detected and one tracking request had been sent (its ACK had not yet arrived in the snapshot). The operator-selected saved look-left request was accepted at 0.499 seconds. At 14.513 seconds deliberate ownership was still held and the tracking request count was unchanged at 1. At 30.554 seconds the tracking window had ended, with no new tracking requests. Final controller state: pan 2100 / tilt 871, holding true, moving false, body busy false. GrowBot remained paused. Camera and tracking were then turned off without a centering or force-release request.

Physical observation of this handoff awaits owner feedback. No face was detected in the post-look snapshot, so this trial alone does not demonstrate resistance to a still-visible face after the yield deadline. Nor does it isolate face-loss behavior while tracking owns the head. Those remain separate checks; offline tests cover them but do not substitute for the physical observations. This was an operator-selected saved gesture, not a model-selected look.

## Visible-face handoff confirmed

The owner clarified that the apparent rightward turn was GrowBot's own left; the direction mapping was not changed. After centering run 16, the owner confirmed physical center and authorized continued tests.

The next 30-second trial established acknowledged tracking over 2.52 seconds with seven head-tracking requests, then accepted the operator-selected saved look-left at 2.653 seconds. At 16.689 seconds a face remained visible, deliberate ownership was still held, and tracking request count was still seven. There were 41 sampled visible-face observations after the old yield deadline with no new tracking request. The window ended at 30.389 seconds; final controller state was pan 2100 / tilt 881, holding true, moving false, body busy false, and GrowBot remained paused. The owner confirmed: "Yes—held left; legs still." This supports the stationary command-path handoff with a visible face; it remains an operator-selected look, not a model-selected choice.

Centering run 25 then completed at 1500/855. The first attempt to start the separate face-loss trial failed at a read-only preflight request with "Pico head ACK timed out," before tracking started. Tracking remained off, while the page socket still reported open/ready. A fresh preflight immediately afterward received valid Pico replies without reset or firmware changes. The cause of that individual timeout remains unknown; do not describe the controller connection as fully fixed.

## Face-loss retry: command behavior observed, trial stopped by timeout

On the retry, a face was initially visible. At 8.490 seconds it disappeared with 19 tracking requests sent, and at 11.119 seconds reappeared (the next request brought the count to 20). Another absence was sampled from 12.135 through 13.144 seconds. The longest observed absence was 2.629 seconds, shorter than the requested five-second physical step-away. Across 16 absent-face polling samples there were zero new tracking requests; the tracker reacquired the face and resumed head targets on return.

After 32 total tracking requests the tracker stopped with `Pico head ACK timed out`. **This was not a successful normal-expiry test.** The original helper reported `windowEnded:true` merely because running was false; the helper now separately reports `stopped`, `windowExpired`, and the actual reason to avoid conflating a timeout with scheduled expiry. A post-stop preflight again received Pico replies: pan 1449 / tilt 825, holding true, moving false, body busy false; GrowBot remained paused. No reset, reconnection, or firmware change was needed for that fresh response. The timed-out request's exact controller/network stage is unknown.

Camera/tracking were stopped and full sleep restored without a head-release or new centering command. Physical face-loss/reacquisition feedback is pending. Further powered testing is paused pending review of the repeated reply timeout; this report does not claim a complete connection fix or a completed OwlBot handoff test.

## Owner reports failed physical reacquisition; timeout path reproduced offline

The owner subsequently reported: he initially followed, but after stepping away and returning there was no following. **Physical reacquisition failed.** The brief command-side resumption above does not establish a successful physical return or sustained following.

Inspection and an added offline characterization reproduce the exact behavior: any missing head ACK reaches the three-second request timeout; the tracking tick calls `stop(error)`, clears its scheduling timer, and leaves running false. Returning faces cannot restart that stopped loop. This establishes a prototype recovery deficiency, not why the original ACK was missing. No recovery behavior or live motion was changed in this diagnostic step.

Eight subsequent read-only requests (four dog_info and four head_info) all succeeded in 81–213 ms. Pico uptime increased from 4,101,298 to 4,103,601 ms during these reads; failures=2, connections=3, radio_resets=1, and fault count=2 were unchanged. RSSI was -71 to -72 dBm. Free-memory snapshots decreased from 170,128 through 136,896 / 104,000 to 69,504 bytes; these short snapshots alone do not establish a leak. Head run ID remained 57, pan 1449 / tilt 825, moving false, holding true. These are post-failure readings, not an uptime capture across the failed ACK; the fault timings and original network stage remain uncorrelated.

The proposed next repair is a bounded communication-recovery state, using fresh read-only controller checks and a fresh camera frame before any new head target. It must never replay the uncertain movement, regain a deliberately yielded head, override pause, or extend an expired tracking window. It has not yet been implemented or physically tested.

## Recovery implementation following owner authorization

The owner authorized the repair. Version `stationary-0.5` implements a separate transport-error recovery state: at most three read-only head/calibration-body checks within 15 seconds, further capped by the original tracking window. It does not reopen/re-pair the GrowBot socket, reissue an uncertain movement, release head support, or wake the model. Controller rejections remain terminal rather than being retried as transport failures.

Recovery requires valid head calibration, an idle head/body, retained support, and then a new selfie frame after the read-only checks. Deliberate look ownership is preserved. Stop/Sleep/hidden page/expiry cancels recovery, including when a read is already pending. Last fault evidence survives routine Stop/bench cleanup; recovery progress and success counts are available in status. The face-loss test excludes recovery-cleared/stale camera state from observations of actual disappearance.

Offline tests pass for lost movement ACK, read-only recovery without replay, absent face after recovery, fresh-frame resumption, late old ACK, deliberate look during recovery, expiry, Stop/Sleep/page-hidden during a pending probe, exhaustion, and released-support refusal. These prove the simulated control paths, not restored physical tracking on this robot. No Pico firmware changes were made for this repair, and the source remains unpushed.

Version 0.5 was installed into the current GrowBot browser session while GrowBot remained asleep, with camera/tracking off. A read-only live preflight succeeded against the 400-speed Pico, with head support enabled. No movement was sent during this repair. A new powered physical face-loss/return trial is still required; reloading the page removes this session-only prototype.

## 24 September: live GrowBot reattachment and normal-expiry trial

The owner confirmed GrowBot awake on the bench, Pico USB connected and servo power initially disconnected. Remote debugging was reattached to the foreground GrowBot browser page, not the OwlBot WebView. The previous injection was absent. Thinking/autonomous movement were paused and version 0.5 installed; read-only preflight confirmed supported head control at 400 µs/s. The selfie camera remained available in head-only bench mode. All three offline test programs passed again.

After the owner confirmed servo power restored and readiness, the centering helper encountered a three-second head ACK timeout. The helper did not return a completed centering result; the timeout alone does not identify which request failed. No movement was blindly repeated. Eight follow-up read-only requests succeeded in 234–1,638 ms, reporting head run 1 at pan 1500 / tilt 855, holding true and moving false. Pico uptime advanced from 35,791,757 to 35,797,600 ms during those reads; link failures=20, connections=20, radio resets=0, fault count=4 were stable. RSSI varied from -71 to -75 dBm. These observations do not establish the cause of the earlier timeout or a complete connection fix.

The subsequent 30-second tracking trial sent 46 head-tracking requests and ended normally (`Tracking window ended`, total helper elapsed 31,845 ms including checks). Final commanded head state: pan 1461 / tilt 831, holding true, moving false; body idle and GrowBot paused. Recovery was not entered and no tracking fault was recorded. A face remained detected throughout, so this trial demonstrates normal expiry at the command level, **not disappearance/reacquisition or transport-fault recovery**. The owner was asked to repeat the trial with a full five-second step outside the camera view and to confirm actual physical following/holding.

The owner confirmed physical following and holding with legs still. The repeat recorded face loss at 6,056 ms and return at 11,370 ms; a second loss at 14,407 ms and return at 19,667 ms; a final loss at 24,486 ms continued until expiry. Across 80 absent-face samples, no new tracking targets were issued. There were 29 total tracking requests; both returns resumed targets, and the window ended normally. Final commanded state was pan 1180 / tilt 792, holding true, moving false, body idle, brain paused. No transport recovery was entered. The owner confirmed: "Yes—resumed following; legs still." **Face-loss/return and expiry are physically confirmed on version 0.5; recovery after an actual missing ACK remains offline-tested only.**

A subsequent centering command completed as run 77 at pan 1500 / tilt 855, holding true. The first version-0.5 handoff repeat was aborted before the saved look: a tracking ACK was recorded, but the face was no longer visible when the helper required it. This is an incomplete trial, not an arbitration failure. The helper's message was clarified, and its prerequisite now rejects retained ACKs from earlier trials.

## 24 September: final handoff repeat and cleanup

The repeat established tracking at 2,550 ms with two tracking requests, then accepted the saved look-left at 2,969 ms. At 16,998 ms, deliberate ownership was still held and tracking requests remained two. Normal expiry occurred at 30,933 ms, still with two tracking requests. Final commanded head position was pan 2100 / tilt 855, holding true, moving false, body idle, GrowBot paused. The owner reported: "yes he followed then looked left and held even when i moved in front of him again."

There were zero post-yield visible-face samples in this repeat. Therefore its owner-observed handoff is confirmed, but this particular camera record does not independently establish that a detected face was ignored after the turn. The earlier 0.4 visible-face run and the expanded offline 0.5 regression test provide separate evidence; they are not relabeled as one trial.

The offline natural-attention regression explicitly establishes an automatic face glance, sends a native saved-look command, advances past multiple glance intervals without new tracking targets, then verifies that an explicit `track face` choice resumes. This tests the real prototype arbitration with a simulated camera/controller, not autonomous model decision-making.

Tracking and the test camera were stopped after the final run. GrowBot was left paused, with no new centering, body movement, or force-release command. No camera images, creature memories, credentials, or private pairing data are included in this report.
