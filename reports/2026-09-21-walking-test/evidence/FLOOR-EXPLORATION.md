# GrowBot native exploration and Brit's recovery experiments

2026-09-21. Times below are UTC. This is a finite test, not a claim that the
intermittent connection defect is fixed.

## Conditions and scope

- Owner confirmed floor readiness and explicitly requested waking GrowBot,
  conversing with him, and letting his own agent control the body.
- Used the existing native resume, conversation input, camera and action executor.
  Did not replace the brain, movement selection, socket callbacks or retry logic.
- Model selection remained `glm-5.3-flash:cloud` through the existing custom-server
  route. The route's local label does not imply local GLM inference.
- Camera video was live (240 x 320, readyState 4); thinking events generally
  reported three frames (a later tick reported one). This proves image input,
  not correct depth/obstacle perception.
- Owner confirmed: "He is moving and has clear space."
- Pico USB was absent during the floor test: no floor serial capture, REPL,
  firmware read/write, flash or reset was performed by the operator.
- Owner confirmed a power change/reset during bench-to-floor transfer. The lower
  floor uptime versus bench baseline must NOT be reported as a spontaneous crash.
- Phone page was foreground/visible. Screen-lock recovery was not tested.
- XB10 security mode remains unknown. No router settings changed.

## Test 1: stale-socket watcher without diagnostic polling

File: `floor-explore-watch-only-2026-09-21T21-54-46-898Z.json`

- 21:54:48.146 to 21:58:02.457 (194.311 seconds).
- Native exploration request selected a cardboard box, followed by head gestures
  and four completed native forward-walk reports (3.031, 3.019, 4.006, 3.004 s).
- Heartbeat uptime increased from 350,108 to 540,821 ms.
- No STALE line, forced close, close event, replacement socket or debugging gap.
- Console contained only arming and watching-OPEN-socket messages.

**Result: no failure reproduced; automatic recovery remains unproven.** Absence
of STALE during a healthy run does not distinguish Brit's failure theories.

An earlier separate 90-second `floor-watch-only` file contains a direct native
six-second gait check. That check was not autonomous exploration and is not
counted in the native-agent walk totals below.

## Test 2: dog_info every five seconds plus the same watcher

File: `floor-explore-poll-and-watch-2026-09-21T21-58-15-153Z.json`

- 21:58:16.402 to 22:01:16.402 (180 seconds).
- 36 successful diagnostics; zero missed replies, cancelled-at-expiry requests,
  debugging gaps, forced closes or socket close events.
- Diagnostic uptime 555,143 to 730,159 ms: no reset during this phase.
- RSSI -71 to -66 dBm along the short observed exploration, not a whole-room survey.
- Memory 1,600 to 308,656 bytes, ending at 221,376 bytes. At 21:59:36.559,
  free memory was 1,600 bytes, but that request succeeded and counters did not
  change. Memory subsequently recovered. Consistent with GC behavior, but neither
  a diagnosed leak nor proof that future under-motion MemoryError cannot occur.
- Failures=3, connections=1, radio_resets=4 throughout. Heartbeats 95 to 130;
  pings 49 to 66. No new fault-ring entries.
- Existing faults were Wi-Fi association failures at boot uptimes 17,949,
  36,451 and 56,952 ms, all before floor recordings. They were not new walking
  failures. Stage=wifi_association, io=idle, "Wi-Fi association did not complete."
- One additional native forward-walk report completed in 5.017 seconds. Much of
  this phase was thinking/talking/stationary, NOT sustained walking stress.

Polling supplies incoming traffic and allocates on the Pico; this is why it is
separate from Test 1. No post-failure series exists because no failure occurred.

## Native-agent behavior critique

The `native-exploration-*.json` trace retains new test robot reply excerpts and
action outcomes. Five native walks completed across the two phases, totaling
18.077 seconds of browser-reported walking. Owner confirmed physical walking,
but each individual gesture, distance and direction was not independently measured.

1. Several replies claimed turning or a completed turn while their thinking
   event recorded `moved: still`, with no corresponding new turn action in the
   trace. Do not treat speech as physical execution. Earlier gesture windows can
   overlap later replies, so `still` alone does not prove all motors were stationary.
2. A backward request was explicitly blocked as `not_admitted` during the first
   phase. That is an action-admission result, not evidence of a socket failure.
3. Later he said "My legs aren't answering" and "legs limp" without a new
   recorded movement attempt. Diagnostic ACKs and heartbeats continued. At
   22:01:08.155 the native body receive timestamp was only 88 ms old, ready was
   true, and WebSocket state was OPEN. His explanation is unsupported by the
   transport evidence; this does not independently prove servo power or torque.
4. He described the box as almost touching but chose another forward walk.
   Operator asked him to check clearance/choose a clear route; owner then
   confirmed physical movement and clear space. Depth/progress claims remain
   unverified and should not be used as measured distance.
5. Frequent narration with no new executable action limits how much actual
   walking this test generated. Investigate model action output, executor admission,
   gesture resolution and outcome feedback separately from the Pico link issue.

## End state and next useful reproduction

At 22:01:32.168 native hard pause was verified: paused=true, inFlight=false,
motion=false, camera=false, bodyReady=true, probeActive=false. No pairing prompt,
reload or reset was used for recovery. Both socket probes cleaned up normally.

Next useful evidence is a longer supervised run that actually reproduces a drop,
with these same separately labeled phases. Do not call the reconnect fix proven
until a stale OPEN socket is closed and recovers through the app's existing retry
path, without manual pairing. Preserve firmware and annotate power/phone changes.

Files remain private working evidence; the public evidence repo was not changed.
No credentials, images, user transcripts or raw network headers are included.
