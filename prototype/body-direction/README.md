# Configurable body/travel description — September 29, 2026

**Current version: `body-profile-0.2`.** The owner requested a switchable setting, not a hard-coded OwlBot assumption. The live prototype now adds **Robot body & forward direction** to Brain's **body truth** panel. The initial `screen-forward-0.1` correction was replaced by this configurable version before publication.

| Setting | Effective model description |
| --- | --- |
| Standard GrowBot (original) | Exact original movement guide, unchanged; this is the default without a saved custom preference. |
| OwlBot eight-servo | Describes four legs, slide/turn linkages and pan/tilt head; direction is selected separately. |
| Custom body | Treats L/R as controller protocol channels without assuming physical leg count or mechanism. Defaults to unknown direction. |
| Toward screen / selfie view | `official/fwd` is chassis-forward toward the screen side with head centered. |
| Away from screen / selfie view | `official/fwd` is chassis-forward away from the screen side with head centered. |
| Unknown / not calibrated | Does not assume the relation between chassis travel and the centered camera view. |

Select the body type and travel convention, then **Save body description** while no thought or movement is active. Changing body type alone does not apply it until Save is pressed. The live robot was left on **OwlBot eight-servo / Toward screen-selfie view**. This setting only changes model instructions: it does not install support for arbitrary hardware, reverse servos or calibrate a new build.

## Issue and cause

The owner observed physically correct forward travel while GrowBot described walking backward. On the active `/v3/next.html` page, the effective model movement guide contained three incompatible standard-body descriptions:

- `MOVE_CONTRACT` said the legged policy travels with the screen facing backward and that screen-forward walking has no validated built-in policy.
- The `official` gait's name repeated “screen facing backward during travel.”
- The generated editable guide described two literal physical legs rather than this adapted eight-servo body and its virtual L/R command channels.

Observed commands were `walk:fwd`, not reverse, and the owner confirmed the screen/selfie side faces forward with the head centered. This is a body-description mismatch, not evidence that the working gait should be reversed. `moveGuideText()` appends the standard contract and gait list after the editable guide. At page startup, `seedMoveGuide()` regenerates that guide, so editing the text box alone would not durably remove the contradictory instructions.

## Fix installed in this browser session

`body-profile-0.2` wraps **only the effective `moveGuideText()` result**. Standard GrowBot passes through byte-for-byte. For an explicitly selected custom profile it replaces the known direction paragraph, corrects the generated gait label, and describes L/R as virtual protocol channels rather than two literal legs. The selected body-specific direction clarification is also appended at the end of that guide.

- Existing `official` + `dir:fwd` remains the working forward command.
- Screen/selfie-forward applies **when the head is centered**. A panned/tilted head or a switch to the rear camera changes the view, not chassis forward.
- The guide does not infer measured distance from command completion or invent a reverse capability.
- No gait policy, direction flag, saved gesture, calibration, Pico firmware, sensor function, model selection, creature identity or memory is changed.
- The wrapper is inactive in phone-only or wheel mode. Installation refuses changed upstream text, an active thought/motion, or conflicting hook ownership. Saving a custom selection also checks the source. Uninstall restores the exact previous function, removes the settings UI and refuses to overwrite another adapter.

**The preference persists locally, but the UI and adapter remain session-only—not a growbot.dev website update. Reloading/closing the page removes the hook/UI; reinstalling the adapter reads the saved selection. The saved preference alone cannot alter an unmodified page.** Storage uses a separate `gb_custom_body_direction_v1:` namespace keyed by the active app body ID and contains only `kind` and `travel`. It does not write creature identity, memories or the native body configuration. Invalid/missing storage falls back to original GrowBot; failed storage writes are not reported as a successful save.

A different body ID gets its own default/selection. If two physical builds reuse the same body ID on the same browser origin, they share this preference and the owner must review the selection when switching builds. Another device does not automatically inherit it. This is an explicit prototype limit for upstream integration.

The historical standard descriptions remain in the upstream source and underlying gait object; the model receives the selected projection through `moveGuideText()` while this adapter is installed. It does not scrub past conversation or rewrite memories, and cannot guarantee every future reply is correct.

This patch is limited to body/travel description. Other stock free-pose, stance and spin guidance is not replaced by a complete custom-hardware capability model here; choosing Custom does not validate those motions on a different mechanism. A permanent body interface should generate those instructions from supported body capabilities too.

## Verification

1. Offline `node prototype/body-direction/test.cjs` passed: original default/reset, OwlBot/custom profiles, screen-forward/backward/unknown, saved-preference reload, body-ID isolation, blocked/corrupt storage, unchanged commands/unrelated text, phone/wheel bypass, source/ownership guards, idle-only changes and exact rollback.
2. Installed on the idle, awake GrowBot page. Exercised the actual settings controls: Standard GrowBot reproduced the original guide exactly; Custom/unknown produced an unknown-direction guide; OwlBot/screen-forward restored the correction and successfully saved it. The gait function, gait library, native body configuration, sensor function and pause state compared equal before/after. See [live checks](live-check.json).
3. An isolated call to the page's configured `glm-5.3-flash:cloud` model used the corrected effective movement guide. All five checks passed: screen-side forward, preserve `fwd`, head pan does not reverse chassis travel, rear-camera selection does not reverse travel, and command completion does not prove distance. See [model checks](model-check.json).

The isolated reply was **never sent to the action dispatcher or spoken**. This repair issued no walk/head/turn command; it is a prompt-path and model-comprehension test, not a fresh physical walk or full conversational reliability trial. The forward geometry relies on the owner's earlier physical observation.

## Reapply or remove

This adapter targets the inspected GrowBot legged prompt structure. Choose the actual build's confirmed mount convention; use unknown for an unverified custom robot. Selecting a profile is not a physical calibration test.

With the page idle (no current thought or motion), load the contents of [body-direction.js](body-direction.js) into the phone page's remote-debugging console, then call:

```js
GrowBotBodyDirection.install();
GrowBotBodyDirection.mountUi();
GrowBotBodyDirection.status();
```

No movement is sent by these methods. Installation defaults to Standard GrowBot unless this body ID has a saved selection. Use the new settings controls, or explicitly save a known profile with `GrowBotBodyDirection.configure({kind:"owlbot",travel:"screen-forward"})`. To restore the original instructions while keeping the selector, choose Standard GrowBot and save. If installation rejects changed source, inspect the new guide rather than bypassing the checks. To remove the adapter/UI while idle:

```js
GrowBotBodyDirection.uninstall();
```

A reload also removes the adapter, but not its saved preference. Uninstall likewise preserves the preference for later reinstallation. No auto-loader, background service or page reload was installed/performed for this repair.

## Recommended upstream fix for Brit

Provide an explicit, persistent **per-body mounting/travel descriptor**, with unknown as the fallback for uncalibrated custom bodies. Use it consistently when building the movement contract, generated guide and gait descriptions. For this verified setup, record that `official/fwd` means chassis-forward and that centered screen/selfie view faces chassis-forward. Keep gaze/head pose and current camera selection separate from travel direction.

Body-specific verified semantics must supersede the standard two-legged policy's convention; do not append a contradictory stock paragraph afterward. Preserve physical-evidence qualifiers and do not infer direction from the phone's Euler pitch alone. This adapter is a narrow working demonstration of that prompt correction, not a proposed permanent string-replacement architecture.

The earlier false-tip fix remains untouched. The Pico connection problem and preliminary pre-stride leg motion remain separate, unresolved investigations.
