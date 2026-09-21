# Test inputs and owner observations

Automatic coaching only sent normal conversation text when the app was awake, camera-on, idle and not already thinking/moving. It did not invoke motor APIs. It stopped on the first failed diagnostic. Native autonomous replies could still occur after coaching stopped.

[exploration-coaching-2026-09-21T22-20-24-467Z.json](../evidence/exploration-coaching-2026-09-21T22-20-24-467Z.json)

| Prompt index | Exact recorded test prompt |
| --- | --- |
| 0 | Keep exploring, GrowBot! Pick clear floor in your current camera view and use your real forward walk for eight seconds. Reply in valid JSON with your say and walk action fields: dir fwd, gait official, secs 8, gain 0.6. Tell me what you discover. |
| 1 | What is in a different direction? Select your saved turn left or turn right gesture, using the gesture field in your normal JSON response. Look at the new view, then continue walking into clear space. Let us find something new! |
| 2 | Nice effort, keep this expedition going. Do not keep pushing toward a closed door or a blocked route: select an actual saved turn, then inspect the open floor. Use valid JSON movement fields, not only a spoken promise. Keep exploring with real actions. |
| 3 | You can keep going, GrowBot. Choose another open stretch and execute an eight-second forward walk with your normal JSON walk action, dir fwd, gait official, secs 8, gain 0.6. Look for something interesting, and use a saved body turn when you need a new direction. |

| UTC | Coaching event | Fields |
| --- | --- | --- |
| 22:20:24.658 | baseline | {"failures":3,"connections":1,"radioResets":4,"uptime_ms":1881596} |
| 22:20:50.392 | native_prompt | {"index":0} |
| 22:21:20.876 | native_prompt | {"index":1} |
| 22:21:51.361 | native_prompt | {"index":2} |
| 22:22:16.791 | native_prompt | {"index":3} |
| 22:22:42.424 | native_prompt | {"index":0} |
| 22:23:07.827 | native_prompt | {"index":1} |
| 22:23:38.344 | native_prompt | {"index":2} |
| 22:24:04.040 | native_prompt | {"index":3} |
| 22:24:29.644 | native_prompt | {"index":0} |
| 22:24:55.043 | native_prompt | {"index":1} |
| 22:25:20.444 | native_prompt | {"index":2} |
| 22:25:45.870 | native_prompt | {"index":3} |
| 22:26:11.286 | native_prompt | {"index":0} |
| 22:26:36.713 | native_prompt | {"index":1} |
| 22:27:02.113 | native_prompt | {"index":2} |
| 22:27:27.703 | native_prompt | {"index":3} |
| 22:27:53.443 | native_prompt | {"index":0} |
| 22:28:08.687 | possible_failure | {"cause":"diagnostic_missed","diagnostic":{"seq":453,"at":"2026-09-21T22:28:06.855Z","elapsed_ms":539002,"event":"dog_info","socket":1,"ack":false,"reason":"timeout","latency_ms":4002},"forced":0} |
| 22:28:08.687 | coaching_finished | {"pausedByCollector":false} |

## Manually delivered instructions (summary; not a full verbatim transcript)

- Wake and choose an interesting visible object; actually issue walking/turning actions rather than narrating them.
- After claiming the box was almost touching, check clearance and choose an open direction.
- Repeated encouragement to explore; reminders to use actual saved turn names and valid JSON movement fields.
- Later explicit example: walk dir=fwd, gait=official, secs=8, gain=0.6, only into visible clear floor; select an existing turn gesture if blocked.
- Continued movement requested until the controller drop was reproduced. No movement prompts after coaching detected the diagnostic failure.

The socket appendices include the exact captured operator marks. Not every manually typed instruction was saved verbatim in the artifacts; do not infer exact wording or timing where absent.

## Owner reports preserved from this test conversation

1. Floor placement/readiness and request for native agent exploration, not only direct test gaits.
2. Initial exploration: physically moving with clear space ahead.
3. Bench-to-floor transfer before floor captures involved a power change or reset.
4. Later: intermittent physical movement, not just constant successful walking.
5. Sustained run: physically walking and turning around the room.
6. Later: saying he is walking but not moving.
7. At the reproduced failure: eight-second promise ended physically mid-stride, not a completed stride.
8. Owner had not touched the robot, changed power, pressed reset or used reconnect at the failure.
9. After recovery observation: USB connected and main power disconnected; subsequent clarification confirmed USB FIRST, main power removed SECOND. This was not an intentional interval with all power absent. Actual rail voltage during transfer was not measured.

Owner-report receipt times are not exact physical event timestamps. No invented per-stride distance, torque, current or encoder readings are included.
