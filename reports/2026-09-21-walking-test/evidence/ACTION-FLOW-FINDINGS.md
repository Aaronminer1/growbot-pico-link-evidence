# Active exploration follow-up: movement stalls with a responsive controller

2026-09-21, beginning 22:08:10 UTC. Owner explicitly requested more movement,
encouragement and native autonomous control rather than ending exploration.
GrowBot was resumed through native controls. No direct gait calls were used in
this follow-up: all movements came from the model's normal conversation/action
path. No firmware, website source, provider settings or safety guards were changed.

## Completed capture results

- Six-minute polled capture: 22:08:10.270 through 22:14:10.270 UTC.
- 72 successful five-second diagnostic requests; zero missed replies, STALE
  closes, socket closes or new fault-ring entries. Recovery remains untested
  because no connection failure occurred.
- Uptime 1,149,013 to 1,504,027 ms. Failures=3, connections=1, radio_resets=4
  remained unchanged. RSSI ranged -75 to -66 dBm; memory 1,136 to 320,288 bytes.
  No recorded reset/MemoryError; low free memory alone is not proof of failure.
- Deduplicated native traces contain six walk starts: five completed ~8-second
  walks (40.091 seconds total), plus one superseded by another walk. This is more
  active walking than the initial test but is NOT six minutes of continuous gait.
- One saved `turn right` gesture and one `look up` gesture were dispatched. These
  are software outcomes, not individually verified distances/directions.
- Across deduplicated parser snapshots, 15 of 27 replies had parsed=false, while
  12 had parsed=true. Two motion_refused events are independently captured.
- The live page log is a rolling buffer: later snapshots can lose early rows.
  The incremental native collectors preserve earlier entries. Deduplicate
  overlapping artifacts rather than summing them or relying on the last snapshot.
- No operator pause was issued at the end of this follow-up; the owner requested
  ongoing awake exploration. Temporary diagnostic collectors expired normally.
  No unattended monitoring or automatic recovery guarantee is implied.

## Two distinct findings for Brit

### 1. Completed model replies that do not parse into structured actions

The selected model remained `glm-5.3-flash:cloud`; saved JSON and vision settings
both remained `1`. Several `reply_status` events report complete=true,
transport=complete, finish=stop, but parsed=false and firstField=unknown. The
following think events speak movement promises but record moved=still, without
a new corresponding movement request.

Examples (event times in epoch milliseconds for exact trace joins):

- 1790028659795: parsed=false; subsequent reply claimed a turn worked and promised
  walking, but recorded still.
- 1790028686850: parsed=false; subsequent reply promised another eight-second
  forward walk, but recorded still.
- After an explicit conversational reminder to use the normal JSON action fields,
  1790028750957 parsed=true, 1790028750958 requested/accepted walk:fwd,
  and 1790028760187 completed the walk.

This does not yet identify whether the malformed/unstructured response originated
in model output, streaming conversion, or parsing. Do not label it a confirmed
model-only fault without inspecting the raw output at that boundary. No raw model
payloads/private context were exported here. Encouragement plus explicit formatting
is a demonstrated workaround for individual turns, not a durable repair.

### 2. Normal walk completion invalidates an in-flight next action

Observed while paused=false and without an operator pause:

- Walk completed at 1790028575192; motion_refused why=stopped, w=1 at
  1790028575733; next reply promised approaching the broom but moved=still.
- Walk completed at 1790028760187; parsed=true reply at 1790028762714 was
  accompanied by motion_refused why=stopped, w=0; it promised turning but moved=still.

Read-only inspection of the live page functions found a matching mechanism:

1. `think` snapshots `_motionGen` as `_mgen` when issuing the model request.
2. `_runGait` calls `carryLegMotion()` on normal duration completion.
3. `carryLegMotion` increments `_motionGen`, including this normal-completion path.
4. `think` later refuses intended motion if `_motionGen !== _mgen`, logging
   `motion_refused` with why=stopped while retaining the reply/caption.

This is strong evidence for a normal-completion/in-flight-action race, distinct
from a lost Pico connection. Suggested review for Brit: separate intentional
cancel/supersede generations from normal completion, while preserving real
pause/hidden/newer-command cancellation. Prevent success-sounding narration from
being treated as successful movement when the associated action is refused.
No website fix was attempted because Brit owns that code and requested no patch.

## Additional evidence limits

- The first reply immediately after resume had nf=0 while camera acquisition was
  starting. Subsequent checks verified live video and replies with fresh images.
  Do not describe that first move as camera-validated.
- An explicit request using the existing saved name `turn right` produced a real
  gesture dispatch at 1790028651558 and completed its software command window.
  That is not independent physical turn measurement.
- `moved: still` does not always mean the body is stationary: an earlier walk can
  still be running. Match action IDs/times and physical observations.
- `capture_brit_exploration.cjs` was extended to capture admission/cancellation
  events. The later overlapping native trace includes these fields; do not add
  counts from overlapping traces together. `action-parser-*.json` snapshots
  preserve parser/guard metadata without utterances or model payloads.
- All captures remain local private working evidence. No public-repo update yet.
