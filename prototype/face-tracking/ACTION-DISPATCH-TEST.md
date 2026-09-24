# Model-to-head dispatch investigation — 24 September 2026

## Findings for Brit

Two specific integration defects were reproduced. Neither is evidence of a Pico disconnect, and neither conclusively explains the earlier floor replies whose raw action structure was not captured.

1. **Silent-action contract mismatch.** The live page's `tryParse` preserves a parsed object only when its `say` field is a string. Calling that parser with valid `{"gesture":"look left"}` returns a speech-only fallback with no gesture. `{"say":"","gesture":"look left"}` preserves the action. Our temporary guide incorrectly allowed omitting `say`. Version **stationary-0.6** now requires an explicit string, with an empty string for silent actions and a concrete top-level gesture example. This fixes our guide, not GrowBot's parser. It is prompt guidance, not a guarantee of future model compliance.

2. **Premature async failure in our quick-look adapter.** In natural-attention mode the adapter created a movement attempt, awaited controller checks, then reported acceptance. The host checks immediately after `moveLegs` returns and marks a still-requested attempt `blocked/no_body_commands`. A live trace recorded `look left` blocked at 1790268400583, then accepted at 1790268403763 after the Pico's commanded state reached its target. Our adapter now reports `accepted/head_request_queued_not_yet_sent` synchronously and `completed/head_target_reached_commanded_state_only` after verification. Real errors still report failure. Admission is not a sent target, and commanded completion is not sensed physical motion.

Suggested host-interface clarification: document whether `say` is mandatory even on action-only JSON; if action-only replies are intended to be supported, preserve validated actions without requiring speech. Also document synchronous admission versus asynchronous target/completion reporting. The local repair makes no change to GrowBot's website or firmware and does not convert spoken promises into inferred motor commands.

## Floor observation before diagnosis

The owner confirmed floor placement, servo power on, USB disconnected but wireless controller connected, secure phone, clear path and supervision. Two conversational requests for a head look produced spoken plans without observed movement requests. The owner confirmed the head did not physically move. Those replies were not captured at the raw parser boundary, so model omission versus an earlier pre-dispatch refusal remains unknown.

A simplified two-second forward-walk request did reach the native gait path. It was accepted at 1790268104821, stance packets began at 1790268104826, walking began at 1790268106030 with ask=2/granted=2, and ended at 1790268108053 (2,023 ms). The owner subsequently confirmed physical forward walking. This is a successful short walk, **not** a successful look-then-walk handoff: the natural-attention test window had expired before that walk.

GrowBot was paused after the failed head observations. The owner then disconnected servo power while keeping the controller online for the diagnostic and retest below.

## Servo-power-off diagnostic

Observers recorded only action structure (field names/types, known gesture name), dispatch, and lifecycle events. They did not retain raw replies, scratchpad contents, images, credentials, or creature memories. The observers called the original functions unchanged and were removed after collection. All tested actions were requested through conversation; the observer did not substitute direct motor commands.

- Native saved `look left`, with a nonempty `say`, survived parsing and was dispatched.
- Native silent `look right`, with `say:""`, survived parsing and was dispatched.
- Natural-attention `look left` survived parsing and reached our quick-look adapter, exposing the contradictory blocked-then-accepted lifecycle described above.
- Direct parser checks reproduced the missing-`say` failure without sending any command.

These successful traces do not retroactively identify the contents of the earlier failed floor replies. Normal follow-up narration can have no action and is not by itself a failure to dispatch a prior action.

## Local repair and verification

Only the session-local prototype guide and quick-look lifecycle reporting changed. No stored body gestures, calibration, identity, memories, website code or Pico firmware were edited. Existing head limits, deliberate-look ownership, tracking windows and transport recovery bounds are unchanged.

The added regression first failed against 0.5 with `blocked` instead of `accepted`, then passed after the repair. It mirrors the host's immediate `no_body_commands` check and proves that synchronous admission precedes any target transmission. It also checks final commanded completion, a real preflight timeout (no false completion or target replay), and the guide's explicit empty-`say` example. All three existing offline suites pass.

Live **0.6** silent right-look retest: valid JSON retained `say:""` and `gesture:"look right"`; the adapter synchronously accepted at 1790268582049 and reported commanded completion at 1790268585569. There was no intervening `no_body_commands` failure. Servo power was off, so no physical movement is claimed.

The first opposite-direction retest encountered a genuine link interruption: the valid silent `look left` reached the adapter, was queued at 1790268642242, then failed at 1790268642245 with `quick_look_failed:Pico socket is not ready`. No completion was reported. The tracking loop also exhausted its three read-only recovery attempts during that interruption. The exact network/controller cause was not established. A later read-only preflight succeeded without a re-pair or firmware change by the operator.

The single subsequent left-look retry passed: valid JSON with `say:""` and `gesture:"look left"` reached the adapter, was queued at 1790268766932 and completed at 1790268769913. No premature `no_body_commands` result occurred. This verifies **both model-selected directions through the corrected asynchronous command path with servo power off**, plus truthful failure reporting during the observed interruption. It does not prove physical head motion or automatic recovery from that interruption.

GrowBot was left paused with tracking and test camera off; temporary diagnostic observers were removed. The session-only 0.6 bridge remains installed and disappears on page reload. A powered model-selected look and the combined floor head-forward/walk handoff remain separate physical checks. The original connection problem is not declared fixed.
