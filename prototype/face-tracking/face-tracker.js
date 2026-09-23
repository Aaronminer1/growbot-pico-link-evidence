/* Stationary GrowBot face tracking. Inject into the existing phone page only;
 * no GrowBot website, account settings, or Pico firmware are modified.
 * Camera pixels stay in this browser. Only bounded head targets go to the Pico.
 */
(function (root, factory) {
  const api = factory(root);
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root && root.document) root.GrowBotFaceTrack = api;
})(typeof window === "undefined" ? globalThis : window, function (root) {
  "use strict";

  const VERSION = "stationary-0.3";
  const PACKAGE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm";
  const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
  const MODEL = "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
  const PERIOD_MS = 220; // Aim for ~4 Hz; inference remains bounded on the phone UI.
  const LIMIT = 0.6; // At most 60% of the owner's saved head range.
  const DEADBAND = 0.10;
  let detector = null, timer = null, running = false, mode = "off";
  let generation = 0, seq = 0, pending = false, lastVideoTime = -1;
  let lastFace = null, count = 0, frames = 0, lastFrameAt = null, lastError = null, lastAck = null;
  let target = {pan: 0, tilt: 0};
  let commanded = {pan: 0, tilt: 0};
  let baseline = {pan: 0, tilt: 0};
  let headChannels = {pan: null, tilt: null};
  let panInverted = null;
  let headSampledAt = 0;
  let axisStep = {pan: 0.08, tilt: 0.2}, panBurst = 0;
  let yieldUntil = 0, bodyBusy = false, lastBodyCheck = 0;
  let watchedSocket = null, originalSend = null, wrappedSend = null;
  let deadline = 0, originalMoveLegs = null, wrappedMoveLegs = null;
  let originalSendTxtFrom = null, wrappedSendTxtFrom = null;
  let motionSpeech = false;
  let attentionUntil = 0, nextAttentionAt = 0, faceStreak = 0, needsResync = false;
  let walkGateSeq = 0, walkGateBusy = false, walkGateError = null;
  let originalRunGait = null, wrappedRunGait = null;
  let originalStopMotion = null, wrappedStopMotion = null;
  const GUIDE_START = "[FACE_TRACK_TOOL_START]";
  const GUIDE_END = "[FACE_TRACK_TOOL_END]";
  function headAim(pose, inverted = false) {
    const pan = inverted ? -pose.pan : pose.pan;
    return {
      pan: pan < -0.12 ? "left" : pan > 0.12 ? "right" : "ahead",
      tilt: pose.tilt < -0.12 ? "down" : pose.tilt > 0.12 ? "up" : "level",
    };
  }
  function guideText() {
    const aim = headSampledAt && panInverted !== null ? headAim(commanded, panInverted) : null;
    return "\n\n" + GUIDE_START + "\n" +
      (aim ? "COMMANDED HEAD AIM RELATIVE TO BODY: " + aim.pan + " / " + aim.tilt + ". This is a Pico target, not physical position feedback.\n" :
        "COMMANDED HEAD AIM: unknown until a fresh Pico head reading. Do not assume the camera faces forward.\n") +
      "OPTIONAL FACE TRACKING TOOL (stationary, head only): If you want to briefly follow a person's face with your head, emit gesture:\"track face\" in this reply. It runs for at most 20 seconds, then shuts itself off. To stop sooner, emit gesture:\"stop tracking\". These two commands are tool signals, not leg poses. Your usual saved look gestures still work and take priority. When natural attention is enabled, a face can draw a brief glance without a request; you may instead look at an object your own vision finds interesting. Do not claim to identify someone from face position alone. Before a new walk, the attention tool returns the commanded head aim forward; if it cannot confirm that command, do not claim to have walked.\n" +
      (motionSpeech ?
        "MOTION SPEECH ON FOR TROUBLESHOOTING: You may briefly speak the requested motion and its result, but do not claim physical movement from an ACK alone.\n" :
        "MOTION SPEECH OFF: Body motion requests, directions, saved look gestures, and face tracking are normally silent. If your reply is only a movement, omit say or leave it empty. Do not read the motion request aloud or announce 'face tracking on.' Continue ordinary conversation when the person actually asks to talk.\n") + GUIDE_END;
  }
  function removeGuide(value) {
    const start = value.indexOf(GUIDE_START), end = value.indexOf(GUIDE_END);
    if (start < 0 || end < start) return value;
    const before = value.slice(0, start).replace(/\n\n$/, "");
    return before + value.slice(end + GUIDE_END.length);
  }
  function refreshGuide() {
    if (!wrappedMoveLegs) return;
    const guide = root.document && root.document.getElementById("moveGuide");
    if (guide) {
      const next = removeGuide(guide.value) + guideText();
      if (guide.value !== next) guide.value = next;
    }
  }
  // The selfie camera is mirrored relative to this robot's physical pan axis.
  // Bench verification found -1/-1 tracks the person on both axes.
  let options = {panSign: -1, tiltSign: -1, verticalAim: 0.42};

  function clamp(value, lo, hi) { return Math.max(lo, Math.min(hi, value)); }
  function chooseFace(detections, previous, width, height) {
    const boxes = (detections || []).map(d => d.boundingBox).filter(Boolean);
    if (!boxes.length) return null;
    const ranked = boxes.map(b => ({
      cx: (b.originX + b.width / 2) / width,
      cy: (b.originY + b.height / 2) / height,
      area: b.width * b.height / (width * height),
    }));
    ranked.sort((a, b) => {
      if (!previous) return b.area - a.area;
      const da = Math.hypot(a.cx - previous.cx, a.cy - previous.cy);
      const db = Math.hypot(b.cx - previous.cx, b.cy - previous.cy);
      // Keep a nearby face unless a different face is much more prominent.
      const sa = da - 0.25 * Math.sqrt(a.area);
      const sb = db - 0.25 * Math.sqrt(b.area);
      return sa - sb;
    });
    return ranked[0];
  }
  function smoothFace(current, previous) {
    if (!current || !previous) return current;
    if (Math.hypot(current.cx - previous.cx, current.cy - previous.cy) > 0.3) return current;
    return {cx: previous.cx * 0.45 + current.cx * 0.55,
      cy: previous.cy * 0.45 + current.cy * 0.55,
      area: previous.area * 0.45 + current.area * 0.55};
  }
  function nextTarget(current, face, signs, steps = {pan: 0.08, tilt: 0.2}) {
    const errorX = 2 * face.cx - 1;
    // This mounted selfie camera sees a comfortably placed face around 42%
    // image height. Centering on 50% spent the entire upward servo range.
    const errorY = 2 * (face.cy - (signs.verticalAim ?? 0.42));
    return {
      pan: clamp(current.pan + (Math.abs(errorX) > DEADBAND ? clamp(errorX * 0.22 * signs.panSign, -steps.pan, steps.pan) : 0), -LIMIT, LIMIT),
      tilt: clamp(current.tilt + (Math.abs(errorY) > DEADBAND ? clamp(errorY * 0.35 * signs.tiltSign, -steps.tilt, steps.tilt) : 0), -LIMIT, LIMIT),
    };
  }
  function video() {
    return [...root.document.querySelectorAll("video")].find(v =>
      v.videoWidth > 0 && v.videoHeight > 0 && v.srcObject &&
      v.srcObject.getVideoTracks().some(t => t.readyState === "live" && t.getSettings().facingMode === "user"));
  }
  function socket() {
    const ws = root._body && root._body.ws;
    if (!ws || ws.readyState !== 1 || !root._body.ready) throw Error("Pico socket is not ready");
    return ws;
  }
  function unwatchSocket() {
    if (watchedSocket && watchedSocket.send === wrappedSend) watchedSocket.send = originalSend;
    watchedSocket = originalSend = wrappedSend = null;
  }
  function watchSocket() {
    const ws = socket();
    if (watchedSocket === ws) return;
    unwatchSocket();
    originalSend = ws.send;
    wrappedSend = function (data) {
      // Observe only the command type. Never log the payload or secret relay URL.
      try {
        const message = JSON.parse(data);
        if (!String(message.rid || "").startsWith("face-track-")) {
          if (["act", "routine"].includes(message.t)) {
            yieldUntil = Math.max(yieldUntil, Date.now() + 12000);
            needsResync = true;
            attentionUntil = 0;
            headSampledAt = 0;
            refreshGuide();
          }
          else if (["pose", "stop"].includes(message.t)) yieldUntil = Math.max(yieldUntil, Date.now() + 2500);
          else if (message.t === "dog_cal" && (message.channel_action === "head_move" || message.body_action === "head")) {
            yieldUntil = Math.max(yieldUntil, Date.now() + 12000);
            needsResync = true;
            attentionUntil = 0;
            headSampledAt = 0;
            refreshGuide();
          }
        }
      } catch { /* Native GrowBot owns the transport; do not interfere. */ }
      return originalSend.call(this, data);
    };
    ws.send = wrappedSend;
    watchedSocket = ws;
  }
  function send(message, timeoutMs = 3000) {
    const ws = socket();
    const rid = "face-track-" + Date.now() + "-" + (++seq);
    return new Promise((resolve, reject) => {
      let done = false;
      const end = (error, value) => {
        if (done) return;
        done = true;
        clearTimeout(timeout);
        ws.removeEventListener("message", onMessage);
        ws.removeEventListener("close", onClose);
        error ? reject(error) : resolve(value);
      };
      const onClose = () => end(Error("Pico socket closed"));
      const onMessage = event => {
        let reply;
        try { reply = JSON.parse(event.data); } catch { return; }
        if (reply.t !== "ack" || reply.rid !== rid) return;
        if (!reply.ok) return end(Error(reply.err || "Pico rejected head request"));
        end(null, reply);
      };
      const timeout = setTimeout(() => end(Error("Pico head ACK timed out")), timeoutMs);
      ws.addEventListener("message", onMessage);
      ws.addEventListener("close", onClose);
      try { ws.send(JSON.stringify({...message, rid})); } catch (e) { end(e); }
    });
  }
  function toSemantic(pulse, channel) {
    const center = channel.center_us;
    const negative = channel.a_us;
    const positive = channel.b_us;
    if (!Number.isFinite(pulse) || !Number.isFinite(center) || !Number.isFinite(negative) || !Number.isFinite(positive)) throw Error("Incomplete head calibration");
    if (pulse === center) return 0;
    const towardNegative = Math.sign(pulse - center) === Math.sign(negative - center);
    const endpoint = towardNegative ? negative : positive;
    if (endpoint === center) throw Error("Head endpoint equals center");
    const magnitude = Math.abs((pulse - center) / (endpoint - center));
    return clamp(towardNegative ? -magnitude : magnitude, -1, 1);
  }
  async function headPreflight() {
    const info = await send({t: "dog_cal", channel_action: "head_info"});
    const map = await send({t: "dog_cal", channel_action: "info"});
    const state = info.state;
    const channels = map.channel_state && map.channel_state.channels || [];
    panInverted = typeof map.saved_body_command?.pan_inverted === "boolean" ?
      map.saved_body_command.pan_inverted : null;
    if (!state || !state.support_enabled || !Number.isFinite(state.max_speed_us_s) ||
        state.max_speed_us_s > 200 || state.max_speed_us_s < 100)
      throw Error("Head support or speed limit is not configured");
    for (const axis of ["pan", "tilt"]) {
      const cfg = state.config && state.config[axis];
      const ch = cfg && channels.find(c => c.channel === cfg.channel);
      const labels = axis === "pan" ? ["left", "right"] : ["down", "up"];
      if (!ch || !ch.enabled || !ch.calibrated || ch.a_name.toLowerCase() !== labels[0] || ch.b_name.toLowerCase() !== labels[1])
        throw Error("Head " + axis + " calibration labels do not match");
      if (Math.min(ch.a_us, ch.b_us) >= ch.center_us || Math.max(ch.a_us, ch.b_us) <= ch.center_us)
        throw Error("Head " + axis + " center is outside saved endpoints");
      headChannels[axis] = ch;
      // Aim a short distance ahead of the Pico's CURRENT commanded PWM, not
      // ahead of our previous target. This prevents an old target backlog.
      // The Pico still enforces its reported mechanical speed cap on both axes.
      const span = Math.max(Math.abs(ch.a_us - ch.center_us), Math.abs(ch.b_us - ch.center_us));
      axisStep[axis] = axis === "pan" ?
        clamp(state.max_speed_us_s * PERIOD_MS * 2.5 / 1000 / span, 0.03, 0.15) :
        clamp(state.max_speed_us_s * PERIOD_MS * 1.7 / 1000 / span, 0.04, 0.30);
      const pulse = (state.targets && state.targets[axis]) ?? (state.last_commanded && state.last_commanded[axis]) ?? ch.center_us;
      target[axis] = toSemantic(pulse, ch);
      commanded[axis] = toSemantic((state.commanded && state.commanded[axis]) ??
        (state.last_commanded && state.last_commanded[axis]) ?? pulse, ch);
      baseline[axis] = target[axis];
    }
    headSampledAt = Date.now();
    refreshGuide();
    return {head: state, saved: map.saved_body_command, baseline: {...baseline}, bodyBusy: !!(
      map.named_walk?.running || map.named_turn?.running ||
      map.saved_body_command?.active || map.stock_pose?.active)};
  }
  async function quickLook(name) {
    if (mode !== "attend" || !["look left", "look right"].includes(name))
      throw Error("Quick look requires natural attention and a left/right direction");
    if (root.paused || root._pauseHard || root._motion?.kind === "walk")
      throw Error("Quick look is unavailable while paused or walking");
    const token = generation, motionToken = ++walkGateSeq;
    walkGateBusy = false; attentionUntil = 0;
    yieldUntil = Date.now() + 11000;
    for (let tries = 0; pending && tries < 15; tries++)
      await new Promise(resolve => setTimeout(resolve, 200));
    if (pending || token !== generation || motionToken !== walkGateSeq)
      throw Error("Quick look was superseded by an in-flight head move");
    const preflight = await headPreflight();
    if (token !== generation || motionToken !== walkGateSeq || mode !== "attend" ||
        root.paused || root._pauseHard || root._motion?.kind === "walk")
      throw Error("Quick look was superseded");
    if (preflight.bodyBusy) throw Error("Another body command is still active");
    if (preflight.saved?.pan_inverted !== true && preflight.saved?.pan_inverted !== false)
      throw Error("Saved-look pan mapping is unknown");
    const position = quickLookPosition(name, preflight.saved.pan_inverted);
    const ack = await send({t: "dog_cal", body_version: 1, body_action: "head", axis: "pan", position});
    if (token !== generation || motionToken !== walkGateSeq) throw Error("Quick look was superseded");
    target.pan = position;
    const desiredPulse = ack.state?.targets?.pan;
    if (!Number.isFinite(desiredPulse)) throw Error("Pico did not report a pan target");
    const pwm = ack.state?.commanded?.pan;
    if (Number.isFinite(pwm)) commanded.pan = toSemantic(pwm, headChannels.pan);
    headSampledAt = Date.now();
    needsResync = true;
    refreshGuide();
    for (let tries = 0; tries < 20; tries++) {
      if (token !== generation || motionToken !== walkGateSeq || root.paused || root._pauseHard)
        throw Error("Quick look was interrupted");
      const state = (await send({t: "dog_cal", channel_action: "head_info"})).state;
      if (token !== generation || motionToken !== walkGateSeq) throw Error("Quick look was interrupted");
      const currentPulse = state?.commanded?.pan;
      if (!Number.isFinite(currentPulse)) throw Error("Pico pan state unavailable");
      commanded.pan = toSemantic(currentPulse, headChannels.pan);
      headSampledAt = Date.now();
      refreshGuide();
      if (!state.moving) {
        if (Math.abs(currentPulse - desiredPulse) > 3)
          throw Error("Head stopped before reaching the short-look target");
        yieldUntil = Date.now() + 3000;
        nextAttentionAt = Date.now() + 6000;
        lastAck = {source: "quick look", name, position, accepted: true,
          targetReachedByCommandedState: true, physicalFeedback: false, at: Date.now()};
        return {name, position, accepted: true, targetReachedByCommandedState: true,
          physicalFeedback: false};
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    throw Error("Quick look timed out before the Pico reached its target");
  }
  async function loadDetector() {
    if (detector) return detector;
    const {FaceDetector, FilesetResolver} = await import(PACKAGE);
    const fileset = await FilesetResolver.forVisionTasks(WASM);
    detector = await FaceDetector.createFromOptions(fileset, {
      baseOptions: {modelAssetPath: MODEL, delegate: "CPU"},
      runningMode: "VIDEO", minDetectionConfidence: 0.65,
    });
    return detector;
  }
  async function refreshBodyBusy() {
    const now = Date.now();
    if (now - lastBodyCheck < 1500) return bodyBusy;
    const reply = await send({t: "dog_cal", channel_action: "info"});
    lastBodyCheck = now;
    bodyBusy = !!(reply.named_walk?.running || reply.named_turn?.running ||
      reply.saved_body_command?.active || reply.stock_pose?.active ||
      reply.stock_pose?.stock_walk?.running);
    return bodyBusy;
  }
  function travelDirection(spec) {
    const dir = String(spec && spec.dir || "fwd").toLowerCase();
    return /^(fwd|forward|ahead|go|straight|walk|closer|left|right)$/.test(dir) ||
      ["spin_left", "spin_right"].includes(spec && spec.gait);
  }
  function quickLookPosition(name, panInverted) {
    if (!["look left", "look right"].includes(name) || typeof panInverted !== "boolean")
      throw Error("Quick look needs a direction and calibrated pan mapping");
    return (name === "look left" ? -1 : 1) * (panInverted ? -1 : 1) * 0.30;
  }
  async function headForward(stillCurrent = () => true) {
    const check = () => {
      if (!stillCurrent() || root.paused || root._pauseHard || root.document.hidden)
        throw Error("Head-forward preparation cancelled");
      socket();
    };
    check();
    // An independent saved look may still be finishing. Let it complete,
    // rather than turning a natural look-then-walk choice into a refusal.
    let preflight;
    for (let tries = 0; tries < 20; tries++) {
      check();
      preflight = await headPreflight();
      check();
      if (!preflight.bodyBusy) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    if (preflight.bodyBusy) throw Error("Body remained busy; walk withheld");
    for (const axis of ["pan", "tilt"]) {
      if (Math.abs(target[axis]) < 0.02) continue;
      check();
      await send({t: "dog_cal", body_version: 1, body_action: "head", axis, position: 0});
      check();
    }
    // Commanded targets, not encoder feedback. Wait for the Pico's paced head
    // controller to finish before forwarding the walk to GrowBot.
    for (let tries = 0; tries < 60; tries++) {
      check();
      const state = (await send({t: "dog_cal", channel_action: "head_info"})).state;
      check();
      if (!state?.moving) {
        if (["pan", "tilt"].some(axis => !Number.isFinite(state.commanded?.[axis]) ||
            Math.abs(state.commanded[axis] - headChannels[axis].center_us) > 3))
          throw Error("Head stopped before reaching forward");
        target.pan = target.tilt = 0;
        commanded.pan = commanded.tilt = 0;
        headSampledAt = Date.now();
        refreshGuide();
        attentionUntil = 0;
        nextAttentionAt = Date.now() + 12000;
        return {commandedForward: true, physicalFeedback: false};
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    throw Error("Head did not finish centering before the walk");
  }
  function savedLookFrames(name) {
    const op = {"look left": 3, "look right": 4, "look up": 5,
      "look down": 6, "look ahead": 7}[name];
    if (!op) throw Error("Only saved look gestures are allowed");
    const values = [87, 93, 88, 90 + op, 107 - op, 92, 86, 90];
    const duration = [3, 4].includes(op)
      ? [137, 149, 1500, 1500, 1500, 1500, 2000, 2000]
      : [137, 149, 163, 181, 193, 197, 2000, 2000];
    return values.map((v, i) => ({l: v, r: v, ms: duration[i]}));
  }
  function userFaceIntent(value) {
    const text = String(value || "").trim().toLowerCase()
      .replace(/^[.,!?\s]+|[.,!?\s]+$/g, "")
      .replace(/^(?:hey\s+)?growbot[,\s]+/, "")
      .replace(/^(?:please|can you|could you|would you|i want you to|i'd like you to)\s+/, "");
    if (/^(?:stop|quit|end|turn off)\s+(?:(?:the|your)\s+)?(?:face tracking|tracking|following(?:\s+my\s+face)?)\b/.test(text)) return "stop";
    if (/^(?:start\s+)?(?:follow|following|track|tracking)\s+(?:my|the|this)\s+face\b/.test(text) ||
        /^(?:start\s+)?face tracking\b/.test(text)) return "start";
    return null;
  }
  function speechToggleIntent(value) {
    const text = String(value || "").trim().toLowerCase().replace(/[.!?]+$/, "");
    const match = /^(?:(?:hey\s+)?growbot[,\s]+)?(?:(?:please|can you)\s+)?(?:motion requests? speak|motion speech|motion narration|read motion requests aloud)\s+(on|off)$/.exec(text);
    return match ? match[1] : null;
  }
  async function look(name) {
    if (!running || !["track", "coexist"].includes(mode)) throw Error("Tracking is not active");
    if (root._pauseHard) throw Error("Hard pause blocks head gestures");
    const frames = savedLookFrames(name);
    // The existing Pico decoder recognizes only these exact saved frames.
    yieldUntil = Date.now() + 12000;
    needsResync = true; headSampledAt = 0; refreshGuide();
    const reply = await send({t: "act", mode: "replace", steps: frames});
    lastAck = {source: "saved look", name, accepted: true, physicalFeedback: false, at: Date.now()};
    return {name, accepted: true, command: reply.saved_body_command || null};
  }
  function schedule(token) {
    if (running && token === generation) timer = setTimeout(() => tick(token),
      mode === "attend" && Date.now() >= attentionUntil ? 500 : PERIOD_MS);
  }
  async function tick(token) {
    if (!running || token !== generation) return;
    if (mode === "attend" && root.runGait !== wrappedRunGait) {
      stop("GrowBot replaced the walk handler; attention needs reinstalling");
      return;
    }
    if (deadline && Date.now() >= deadline) { stop("Tracking window ended"); return; }
    if (mode === "track" && (!root.paused || root._pauseHard) ||
        ["coexist", "attend"].includes(mode) && (root.paused || root._pauseHard || root.document.hidden)) {
      stop("GrowBot was resumed or hard-paused");
      return;
    }
    const v = video();
    if (!v) { stop("Front camera stopped"); return; }
    try {
      watchSocket();
      if (v.currentTime !== lastVideoTime) {
        lastVideoTime = v.currentTime;
        const result = detector.detectForVideo(v, performance.now());
        frames++;
        lastFrameAt = Date.now();
        count = result.detections.length;
        lastFace = smoothFace(chooseFace(result.detections, lastFace, v.videoWidth, v.videoHeight), lastFace);
        faceStreak = lastFace ? Math.min(3, faceStreak + 1) : 0;
        if (["coexist", "attend"].includes(mode) && Date.now() >= yieldUntil) await refreshBodyBusy();
        // The read-only body check can outlive an operator stop or pause.
        // Never let that delayed reply authorize a new physical command.
        if (!running || token !== generation || (deadline && Date.now() >= deadline) ||
            (mode === "track" && (!root.paused || root._pauseHard)) ||
            (["coexist", "attend"].includes(mode) && (root.paused || root._pauseHard || root.document.hidden))) {
          if (token === generation) stop("Tracking window ended or GrowBot paused");
          return;
        }
        if (needsResync && Date.now() >= yieldUntil && !bodyBusy && !walkGateBusy) {
          await headPreflight();
          needsResync = false;
          if (!running || token !== generation || root.paused && mode !== "track" || root._pauseHard ||
              root.document.hidden || deadline && Date.now() >= deadline) return;
        }
        if (mode === "attend" && Date.now() >= yieldUntil && !bodyBusy && !walkGateBusy &&
            root._motion?.kind !== "walk") {
          if (faceStreak >= 3 && Date.now() >= nextAttentionAt && Date.now() >= attentionUntil) {
            attentionUntil = Date.now() + 4500;
            nextAttentionAt = Date.now() + 12000;
          }
        }
        if (mode === "attend" && (bodyBusy || walkGateBusy || root._motion?.kind === "walk"))
          attentionUntil = 0;
        const faceAttention = mode === "attend" && Date.now() < attentionUntil;
        if ((["track", "coexist"].includes(mode) || faceAttention) && lastFace && !pending &&
            Date.now() >= yieldUntil && !bodyBusy) {
          const next = nextTarget(commanded, lastFace, options, axisStep);
          const panWanted = Math.abs(next.pan - commanded.pan) >= 0.008;
          const tiltWanted = Math.abs(next.tilt - commanded.tilt) >= 0.008;
          // Two pan opportunities per tilt opportunity when both need motion.
          // This makes face-following pan responsive without extra wire traffic.
          const axis = panWanted && (!tiltWanted || panBurst < 2) ? "pan" : "tilt";
          if (Math.abs(next[axis] - commanded[axis]) >= 0.008) {
            pending = true;
            try {
              const ack = await send({t: "dog_cal", body_version: 1, body_action: "head", axis, position: Number(next[axis].toFixed(3))});
              if (token !== generation) return;
              target[axis] = next[axis];
              const pwm = ack.state && ack.state.commanded && ack.state.commanded[axis];
              if (Number.isFinite(pwm) && headChannels[axis]) commanded[axis] = toSemantic(pwm, headChannels[axis]);
              headSampledAt = Date.now();
              refreshGuide();
              panBurst = axis === "pan" ? panBurst + 1 : 0;
              lastAck = {axis, position: target[axis], accepted: true, physicalFeedback: false, at: Date.now()};
            } finally { pending = false; }
          }
        }
      }
      lastError = null;
    } catch (e) {
      stop(e.message || String(e));
      return;
    }
    schedule(token);
  }
  function stop(reason = "Stopped by operator") {
    running = false; mode = "off"; generation++;
    walkGateSeq++; walkGateBusy = false;
    attentionUntil = 0; nextAttentionAt = 0; faceStreak = 0;
    if (timer) clearTimeout(timer);
    timer = null; pending = false;
    lastFace = null; count = 0;
    unwatchSocket();
    deadline = 0;
    lastError = reason;
    // Intentionally do not send head_stop: on this firmware it force-releases
    // the load-bearing tilt servo. The configured static hold remains in charge.
    return status();
  }
  async function start(config = {}) {
    stop("Restarting");
    const setupToken = generation;
    const desired = config.mode || "observe";
    if (!["observe", "track", "coexist", "attend"].includes(desired)) throw Error("mode must be observe, track, coexist, or attend");
    const duration = config.durationMs === undefined ? 20000 : config.durationMs;
    if (desired !== "observe" && (!Number.isFinite(duration) || duration < 1000 || duration > 60000))
      throw Error("Tracking duration must be 1-60 seconds");
    if (!video()) throw Error("GrowBot's live selfie camera is unavailable");
    options = {panSign: config.panSign ?? -1, tiltSign: config.tiltSign ?? -1,
      verticalAim: config.verticalAim ?? 0.42};
    if (![options.panSign, options.tiltSign].every(x => x === 1 || x === -1)) throw Error("Axis signs must be +1 or -1");
    if (!Number.isFinite(options.verticalAim) || options.verticalAim < 0.3 || options.verticalAim > 0.6)
      throw Error("Vertical camera aim must be between 0.3 and 0.6");
    let preflight = null;
    if (desired === "track") {
      if (root._pauseHard) throw Error("GrowBot is hard-paused; tracking will not override it");
      if (!root.paused) root.setPaused(true, false); // Stop autonomous gait, retain live camera/socket.
      if (!root.paused || root._pauseHard || !video()) throw Error("Could not enter stationary tracking mode");
      preflight = await headPreflight();
    } else if (["coexist", "attend"].includes(desired)) {
      if (root.paused || root._pauseHard) throw Error("GrowBot must be awake for coexist mode");
      preflight = await headPreflight();
    }
    if (setupToken !== generation) throw Error("Tracking startup was cancelled");
    if (desired !== "attend" && preflight && !preflight.bodyBusy && Math.abs(target.tilt) > 0.35) {
      // Prepare a neutral vertical posture for the on-demand tracking window.
      // The Pico ramps this at its reported mechanical limit; never snap to center.
      await send({t: "dog_cal", body_version: 1, body_action: "head", axis: "tilt", position: 0});
      for (let tries = 0; tries < 14; tries++) {
        if (setupToken !== generation) throw Error("Tracking startup was cancelled");
        const state = (await send({t: "dog_cal", channel_action: "head_info"})).state;
        if (!state?.moving) break;
        await new Promise(resolve => setTimeout(resolve, 180));
      }
      target.tilt = 0;
      baseline.tilt = 0;
    }
    await loadDetector();
    if (setupToken !== generation) throw Error("Tracking startup was cancelled");
    if (desired === "track" && (!root.paused || root._pauseHard) ||
        ["coexist", "attend"].includes(desired) && (root.paused || root._pauseHard))
      throw Error("GrowBot changed pause state during tracking startup");
    mode = desired; running = true; lastVideoTime = -1; lastFace = null; count = 0; frames = 0; lastFrameAt = null; lastError = null;
    yieldUntil = 0; bodyBusy = false; lastBodyCheck = 0; panBurst = 0;
    needsResync = !!preflight?.bodyBusy;
    attentionUntil = 0; nextAttentionAt = Date.now() + 1500; faceStreak = 0;
    deadline = (["track", "coexist"].includes(desired) ||
      desired === "attend" && config.durationMs !== undefined) ? Date.now() + duration : 0;
    const token = ++generation;
    tick(token);
    return status();
  }
  function status() {
    return {version: VERSION, mode, running, faces: count, frames, lastFrameAt,
      face: lastFace && {cx: +lastFace.cx.toFixed(3), cy: +lastFace.cy.toFixed(3), area: +lastFace.area.toFixed(3)},
      target: {...target}, commanded: {...commanded}, baseline: {...baseline},
      headAim: headSampledAt && panInverted !== null ? headAim(commanded, panInverted) : null,
      panInverted,
      headSampledAt, axisStep: {...axisStep}, lastAck, lastError,
      yieldingToGrowBot: Date.now() < yieldUntil, bodyBusy,
      attentionActive: mode === "attend" && Date.now() < attentionUntil,
      nextAttentionMs: mode === "attend" ? Math.max(0, nextAttentionAt - Date.now()) : 0,
      walkGateBusy, walkGateError,
      remainingMs: deadline ? Math.max(0, deadline - Date.now()) : 0,
      toolAvailable: !!wrappedMoveLegs && !!wrappedSendTxtFrom && !!wrappedRunGait, motionSpeech,
      cameraReady: !!video(), socketReady: !!(root._body && root._body.ready && root._body.ws && root._body.ws.readyState === 1)};
  }
  function installTool() {
    if (wrappedMoveLegs) return status();
    if (root.MODE !== "legs" || typeof root.moveLegs !== "function" ||
        typeof root.sendTxtFrom !== "function" || typeof root.runGait !== "function" ||
        typeof root.stopMotion !== "function")
      throw Error("GrowBot action or user-message path unavailable");
    const guide = root.document.getElementById("moveGuide");
    if (!guide) throw Error("GrowBot's editable movement guide is unavailable");
    originalMoveLegs = root.moveLegs;
    wrappedMoveLegs = function (request) {
      const name = String(request && request.gesture || "").toLowerCase().replace(/\s+/g, " ").trim();
      if (mode === "attend" && ["look left", "look right"].includes(name) &&
          root._motion?.kind !== "walk") {
        attentionUntil = 0;
        let attempt = null;
        try { if (typeof root._moveRequest === "function") attempt = root._moveRequest(name); } catch {}
        quickLook(name).then(() => {
          try { root._moveReport(attempt, "accepted", "paced_head_target_sent_unverified"); } catch {}
        }).catch(error => {
          lastError = error.message || String(error);
          try { root._moveReport(attempt, "blocked", "quick_look_failed:" + lastError); } catch {}
        });
        return;
      }
      if (name !== "track face" && name !== "stop tracking") {
        walkGateSeq++; walkGateBusy = false; attentionUntil = 0;
        return originalMoveLegs.apply(this, arguments);
      }
      let attempt = null;
      try { if (typeof root._moveRequest === "function") attempt = root._moveRequest(name); } catch { /* Diagnostic only. */ }
      if (name === "stop tracking") {
        stop("GrowBot stopped face tracking");
        try { root._moveReport(attempt, "accepted", "face_tracking_stopped"); } catch {}
        return;
      }
      if (root.paused || root._pauseHard || !video()) {
        try { root._moveReport(attempt, "blocked", "face_track_needs_awake_selfie_camera"); } catch {}
        return;
      }
      if (running && mode === "coexist") {
        try { root._moveReport(attempt, "accepted", "face_tracking_already_active"); } catch {}
        return;
      }
      if (running && mode === "attend") {
        attentionUntil = Date.now() + 4500;
        nextAttentionAt = Date.now() + 12000;
        try { root._moveReport(attempt, "accepted", "face_attention_requested_briefly"); } catch {}
        return;
      }
      try { root._moveReport(attempt, "accepted", "face_tracking_requested_20s"); } catch {}
      start({mode: "coexist", durationMs: 20000}).catch(error => {
        lastError = error.message || String(error);
        try { root._moveReport(attempt, "blocked", "face_track_failed:" + lastError); } catch {}
      });
    };
    originalRunGait = root.runGait;
    wrappedRunGait = function (spec) {
      if (mode !== "attend" || !travelDirection(spec) || root._motion?.kind === "walk") {
        walkGateSeq++; walkGateBusy = false;
        return originalRunGait.apply(this, arguments);
      }
      const self = this, args = arguments, gate = ++walkGateSeq;
      walkGateBusy = true; walkGateError = null; attentionUntil = 0;
      Promise.resolve().then(() => headForward(() => gate === walkGateSeq && mode === "attend"))
        .then(() => {
          if (gate !== walkGateSeq || mode !== "attend" || root.paused || root._pauseHard || root.document.hidden)
            return;
          walkGateBusy = false;
          originalRunGait.apply(self, args);
        })
        .catch(error => {
          if (gate !== walkGateSeq) return; // Superseded by Stop or another motion.
          walkGateError = error.message || String(error);
          lastError = "Walk withheld: " + walkGateError;
          try { root.setErr(lastError); } catch {}
        })
        .finally(() => { if (gate === walkGateSeq) walkGateBusy = false; });
    };
    originalStopMotion = root.stopMotion;
    wrappedStopMotion = function () {
      walkGateSeq++; walkGateBusy = false; attentionUntil = 0;
      return originalStopMotion.apply(this, arguments);
    };
    originalSendTxtFrom = root.sendTxtFrom;
    wrappedSendTxtFrom = function (message) {
      const speech = speechToggleIntent(message);
      if (speech) {
        motionSpeech = speech === "on";
        refreshGuide();
        try { root.toast("motion request speech " + speech); } catch {}
        return; // A control setting, not a question for the model to read aloud.
      }
      const intent = userFaceIntent(message);
      if (intent === "stop") stop("Stopped by direct user command");
      else if (intent === "start" && running && mode === "attend") {
        attentionUntil = Date.now() + 4500;
        nextAttentionAt = Date.now() + 12000;
      } else if (intent === "start" && !(running && mode === "coexist")) {
        if (!root.paused && !root._pauseHard && video())
          start({mode: "coexist", durationMs: 20000}).catch(error => {
            lastError = error.message || String(error);
            try { root.toast("face tracking unavailable: " + lastError); } catch {}
          });
        else lastError = "Face tracking needs GrowBot awake with the selfie camera live";
      }
      if (intent && !motionSpeech) {
        try { root.toast(intent === "start" ? "following face briefly" : "face tracking stopped"); } catch {}
        return; // Deterministic motion command; no narrated model round trip.
      }
      return originalSendTxtFrom.apply(this, arguments);
    };
    root.moveLegs = wrappedMoveLegs;
    root.runGait = wrappedRunGait;
    root.stopMotion = wrappedStopMotion;
    root.sendTxtFrom = wrappedSendTxtFrom;
    refreshGuide();
    return status();
  }
  function uninstallTool() {
    stop("Tool uninstalled");
    if (root.moveLegs === wrappedMoveLegs) root.moveLegs = originalMoveLegs;
    if (root.runGait === wrappedRunGait) root.runGait = originalRunGait;
    if (root.stopMotion === wrappedStopMotion) root.stopMotion = originalStopMotion;
    if (root.sendTxtFrom === wrappedSendTxtFrom) root.sendTxtFrom = originalSendTxtFrom;
    originalMoveLegs = wrappedMoveLegs = null;
    originalRunGait = wrappedRunGait = null;
    originalStopMotion = wrappedStopMotion = null;
    originalSendTxtFrom = wrappedSendTxtFrom = null;
    const guide = root.document && root.document.getElementById("moveGuide");
    if (guide) guide.value = removeGuide(guide.value);
    return status();
  }
  return {start, stop, status, preflight: headPreflight, headForward, look, quickLook, installTool, uninstallTool,
    _test: {chooseFace, smoothFace, nextTarget, toSemantic, savedLookFrames, userFaceIntent, speechToggleIntent, travelDirection, headAim, quickLookPosition}};
});
