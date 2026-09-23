# Stationary face-tracking prototype

This optional, temporary browser injection uses GrowBot's existing **selfie camera** and the calibrated Pico `dog_cal` head lane. It does not edit growbot.dev, change the saved gestures, reflash the Pico, walk, or turn the body. No camera images are saved or sent to the relay: MediaPipe inference runs in the phone browser, and only normalized pan/tilt targets cross the controller link. The pinned detector code, WASM, and model are fetched over HTTPS from jsDelivr and Google's model storage on first use.

## Preconditions

- GrowBot open in the phone's Chrome tab with its selfie camera live and controller connected.
- Phone remote debugging connected and forwarded to `tcp:9223` for this test helper.
- For `track` only: robot stationary on a stable surface, head physically supported, servo power explicitly confirmed on, and a person nearby who can use the hardware power switch. First try `observe` with servo power off.
- Pico head calibration must identify Pan A=Left, B=Right and Tilt A=Down, B=Up, with head support enabled. The script verifies these before motion.
- The existing Pico's head speed limit (150 microseconds/second) is not changed. Software targets stay within 60% of each saved calibrated range. Per-frame target steps are scaled from each axis's saved pulse range for approximately 120 microseconds/second maximum requested travel, and the Pico imposes its own hard limit.

## Commands

From this directory, run `node test.cjs`, then `node control.cjs observe` for camera-only detection. `node control.cjs status` reports face count, normalized target, command ACKs, and errors, but no image. `node control.cjs preflight` reads the Pico head mapping without moving it. `node control.cjs stop` ends the loop. After physical setup and operator confirmation, `node control.cjs track` enters a **soft stationary pause** that stops GrowBot's autonomous movement but keeps the camera and controller live; it then sends head-only targets. If the user hard-pauses or resumes GrowBot, tracking stops. A page reload also removes the prototype.

Face tracking is **off by default**, not a continuous behavior. `node control.cjs install` adds a session-only tool bridge to GrowBot's current phone page: his movement guide advertises `gesture:"track face"` and `gesture:"stop tracking"`, and those two named requests are intercepted before the ordinary leg-gesture handler. No creature memories or saved gestures are changed. A direct user phrase such as “follow my face” or “stop face tracking” also starts/stops the tool immediately through GrowBot's shared typed-and-transcribed input path. By default that pure motion request is handled locally and silently, without a model round trip; `motion request speak on` forwards it for narration during troubleshooting, and `motion request speak off` restores silent handling. The first request starts a maximum **20-second** tracking window while he is awake; the second ends it early. `node control.cjs uninstall` removes the bridge and its guide text. A page reload also removes it. This is a prototype using GrowBot's existing gesture action slot as a tool signal; a production implementation should give it a first-class app action with clear UI state.

Face tracking is **not exclusive head authority**. While tracking, `node control.cjs look ahead` (or `look left`, `look right`, `look up`, `look down`) sends the existing eight-frame saved gesture through GrowBot's normal `act` wire format. The tracker yields to that gesture, then reacquires a face. This is a bench test of the handoff, not evidence that GrowBot's own model selected the gesture.

The tool's on-demand window uses `coexist` mode: GrowBot stays awake so he may select his own saved look gestures. The tracker watches outgoing native body commands and yields to them; it also checks Pico movement state before issuing a tracking target. **Do not invoke the model tool on the powered bench**: GrowBot may choose a leg or body movement. Test it on the floor with a nearby operator and clear space, or with servo power off for a command-only check. Awake coexistence is implemented but not physically validated yet. Brit's production app should own the arbitration directly, rather than relying on a debugging-page injection.

This phone/mount was physically checked on the bench: default `panSign=-1`, `tiltSign=-1` followed the person. The selfie camera's image orientation may differ on another mount. If a future test shows the head moving away, stop and invert only that axis for a new bounded test, for example `node control.cjs track 1 -1` (pan inverted from this robot's verified default). Do not increase range/speed to compensate for wrong direction.

The bench camera saw a normally placed face around 42% image height. The tracker uses that as its vertical aim point instead of 50%, and if it starts with tilt near the saved travel edge it first ramps gently to neutral. This preserves room to follow both upward and downward movement without changing the owner's calibration.

`ack` means the Pico accepted a requested target, **not** that the servo physically moved. Human observation is needed to validate actual following. Stopping this script leaves the Pico's configured static head hold in charge; the last accepted small movement may finish. It does not send `head_stop`, which would force-release a load-bearing tilt axis on this firmware. Hardware power is the immediate emergency stop.

The prototype is intentionally session-only. A production version belongs in GrowBot's app so tracking, pause, controller reconnection, and consent share one owner-controlled state machine.
