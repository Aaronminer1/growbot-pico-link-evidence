# Session-only forward-walk tilt correction

This prototype replaces **two expressions in the live `_runGait` function**: the walk's tip-angle calculation and its near-upright learning check. It does not rewrite the website, alter the phone's sensor readings, or touch Pico firmware, creature memories, calibration, gait geometry, speeds, duty limits, or motor permissions. Reload discards the correction.

The original function treats the largest separate beta/gamma difference as physical tilt. Near a vertical phone mount this can be an Euler representation change. The replacement compares vertical vectors computed from the [W3C Z-X-Y DeviceOrientation convention](https://www.w3.org/TR/orientation-event/). It uses `atan2(length(cross),dot)` for a numerically stable angular difference. Heading alpha is intentionally ignored: turning around vertical is not tipping.

## What remains unchanged

- A vector tilt above **55 degrees for five consecutive control iterations** still invokes the original stop/cooldown path.
- The original linear-jolt pickup test (`lin > 11`, six iterations), user Stop, pause/visibility guards, duration and duty-budget checks remain.
- Near-upright calibration learning still requires the existing `<20°` criterion and other original conditions; only its angle calculation changes.
- Invalid numeric angle samples map to a conservative 180-degree deviation rather than being treated as upright. The existing `if (ori)` behavior for a completely missing orientation object is unchanged; this patch does not add sensor-freshness supervision.
- The false certainty of the spoken fall claim is replaced with: “my phone angle changed unexpectedly. I stopped to check.” A phone on a moving head is not a direct chassis attitude sensor.

This prototype does **not** implement head-versus-chassis motion compensation, and does not change the separate wheels `runDrive` tilt check. The tested body is the eight-servo legged build. A permanent multi-body implementation belongs upstream.

## Install, verify, remove

These scripts use the existing scoped Chrome debugging helper, forwarded to localhost port 9223, with exactly one GrowBot page open. Keep GrowBot paused and idle for installation/removal. Installation itself commands no motors. An operator must separately confirm placement, power and path clearance before any physical trial.

```text
node test.cjs
node control.cjs install
node control.cjs status
```

`install` checks the observed source shape and exact original guard anchors before replacing anything; source drift aborts installation. It does not silently patch a newly changed website. Keep this as a temporary compatibility test, not a general website monkey-patch.

To undo while paused and idle:

```text
node control.cjs uninstall
```

Uninstall restores the original function only if this prototype still owns it. Reload also removes the prototype. The existing local face/head controller is independent and retains its normal head-before-walk behavior.

`trial.cjs start` is **not a passive command**: it resumes GrowBot and submits a normal conversational request for one ten-second forward walk. Run only after a fresh, explicit owner-confirmed clear floor test. It does not itself issue gait packets; GrowBot's model and native action path decide execution. `trial.cjs status` reads bounded numeric IMU and scoped gait events; `trial.cjs stop` removes the observer, not the installed correction, and does not stop the robot. Use GrowBot's normal Stop/pause for motion.

The correction retains at most 400 numeric samples from the latest native walk. It adds no repeated Pico diagnostic traffic during movement. The older Euler result is calculated as a shadow measurement only; it does not drive the motors or change sensor values.

## Offline regression checks

`node test.cjs` checks near-vertical representation changes, ordinary sway, yaw-only changes, real 60/90/180-degree tilt, invalid inputs, a grid of vector normalization cases, retention of guard/Stop source, and refusal to patch changed source. These are math and patch-shape tests, not powered fall tests. Do not intentionally tip powered hardware to verify the stop.
