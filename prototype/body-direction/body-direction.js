/* Configurable body-description adapter, not a gait or sensor patch.
 * Preference persists locally per body ID; the hook/UI are session-only.
 * Kept separate from the historical head and tilt prototypes for review.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else if (!root.GrowBotBodyDirection) root.GrowBotBodyDirection = factory(root);
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';
  const VERSION = 'body-profile-0.2';
  const OLD_DIRECTION = 'BODY DIRECTION: this legged policy travels with the screen facing backward, away from the screen-side/front camera view. Its dir=fwd means the policy travel direction, not toward what the front camera sees. Left and right always use the screen/face perspective. Turn to orient the travel direction before approaching a target; do not assume fwd moves toward a visible target. Screen-forward walking has no validated built-in policy; when asked, you can experiment with authored body.steps, then judge progress from observation and feedback.';
  const OLD_LABEL = 'your natural walk, screen facing backward during travel';
  const OLD_BODY = 'You have two legs: l = left, r = right.';
  const DEFAULT = Object.freeze({kind:'growbot', travel:'native'});
  let original = null, wrapper = null, panel = null;
  const preferences = new Map();
  function normalize(value) {
    if (!value || !['growbot','owlbot','custom'].includes(value.kind)) throw Error('Choose a valid body type');
    if (value.kind === 'growbot') return {...DEFAULT};
    if (!['screen-forward','screen-backward','unknown'].includes(value.travel)) throw Error('Choose a valid forward-travel convention');
    return {kind:value.kind, travel:value.travel};
  }
  // Bind preferences to the app's body ID, not private creature text or a token.
  // A different physical build reusing that ID needs its selection reviewed.
  function bodyId() { const id=root.body && root.body.id; return typeof id==='string' && id ? id : null; }
  function storageKey(id) { return 'gb_custom_body_direction_v1:' + encodeURIComponent(id); }
  function preference() {
    const id=bodyId();
    if (!id) return {config:{...DEFAULT},persisted:false,warning:'Body ID unavailable; using standard GrowBot'};
    if (!preferences.has(id)) {
      let config={...DEFAULT}, persisted=false, warning=null;
      try { const raw=root.localStorage.getItem(storageKey(id)); if(raw!==null){config=normalize(JSON.parse(raw));persisted=true;} }
      catch(e){warning='Saved preference unavailable or invalid; using standard GrowBot';}
      preferences.set(id,{config,persisted,warning});
    }
    return preferences.get(id);
  }
  function direction(config) {
    const heading='BODY DIRECTION — SELECTED BODY PROFILE: ';
    const body=config.kind==='owlbot'?'This is the OwlBot eight-servo body. ':'This is a custom adapted robot body; do not assume the stock two-legged mechanism. ';
    const travel=config.travel==='screen-forward'
      ? 'The existing official gait with dir=fwd moves chassis-forward, toward the phone screen and selfie-camera view WHEN THE HEAD IS CENTERED. '
      : config.travel==='screen-backward'
        ? 'The existing official gait with dir=fwd moves chassis-forward, away from the phone screen and selfie-camera view WHEN THE HEAD IS CENTERED. '
        : 'The relationship between official/dir=fwd travel and the centered screen/selfie view is UNKNOWN. Do not label it screen-forward or screen-backward without owner confirmation or observations. ';
    return heading+body+travel+'This is a user-selected description, not a measured direction sensor. Do not reverse the working gait or invent free leg poses to compensate for a description mismatch. Keep the existing saved turn/head commands and calibration. A sideways or tilted head changes where the camera looks, not the chassis forward direction. A rear-camera view is behind the centered phone, not a reversal of walking. A requested forward command is not proof of physical progress; compare observations and owner feedback before reporting movement or distance. A reverse capability must be separately supported; do not invent a back-up command from this setting.';
  }
  const count = (s, part) => s.split(part).length - 1;
  function inspect(text) {
    text = String(text);
    return { direction: count(text, OLD_DIRECTION), label: count(text, OLD_LABEL), body: count(text, OLD_BODY) };
  }
  function correct(text, value) {
    const config=normalize(value);
    if(config.kind==='growbot') return String(text); // Native mode is exactly native.
    const newBody=config.kind==='owlbot'
      ? 'You have an eight-servo body with four legs, slide/turn linkages and a pan/tilt head. The l/r values below are virtual protocol channels interpreted by the Pico, not two literal physical legs.'
      : 'You have a custom adapted body. The l/r values below are virtual protocol channels interpreted by its controller; they do not establish its physical leg count or mechanism.';
    const label=config.travel==='unknown'?'custom body walk; screen-relative travel direction unverified'
      : 'custom body forward walk; '+config.travel+' when head is centered';
    return String(text)
      .split(OLD_DIRECTION).join(direction(config))
      .split(OLD_LABEL).join(label)
      .split(OLD_BODY).join(newBody)
      + '\n\n' + direction(config);
  }
  function legged() { return root.MODE === 'legs' && !root._wheels; }
  function checkSource(text) {
    const matches=inspect(text);
    if(matches.direction!==1||matches.label!==1||matches.body!==1) throw Error('Upstream guide changed; inspect before selecting a custom body');
  }
  function install() {
    if (original) {
      if (root.moveGuideText !== wrapper) throw Error('Guide ownership changed; do not stack or overwrite adapters');
      return status();
    }
    if (root.inFlight || root._motion) throw Error('Wait for the current thought/motion to finish');
    if (!legged() || typeof root.moveGuideText !== 'function') throw Error('Requires the inspected legged GrowBot page');
    checkSource(root.moveGuideText());
    original = root.moveGuideText;
    wrapper = function () {
      const text = original.apply(this, arguments);
      // Never impose this mount convention on phone-only or wheel mode.
      return legged() ? correct(text,preference().config) : text;
    };
    root.moveGuideText = wrapper;
    return status();
  }
  function configure(value) {
    if(!original||root.moveGuideText!==wrapper) throw Error('Install the adapter first');
    if(root.inFlight||root._motion) throw Error('Wait for the current thought/motion to finish');
    if(!legged()) throw Error('This selector applies to legged/adapted bodies, not wheels or phone-only mode');
    const id=bodyId();if(!id) throw Error('Body ID unavailable; cannot save this preference');
    const config=normalize(value);
    if(config.kind!=='growbot') checkSource(original.call(root));
    // Write and read back BEFORE changing the active preference. A blocked/full
    // storage store must not be mistaken for a saved setting.
    const key=storageKey(id), encoded=JSON.stringify(config);
    try { root.localStorage.setItem(key,encoded);if(root.localStorage.getItem(key)!==encoded)throw Error('Read-back mismatch'); }
    catch(e){throw Error('Could not save the body setting; selection was not applied');}
    preferences.set(id,{config,persisted:true,warning:null});
    return status();
  }
  function mountUi() {
    if(!original||root.moveGuideText!==wrapper)throw Error('Install the adapter first');
    if(panel && panel.isConnected)return status();
    const doc=root.document, anchor=doc && doc.getElementById('vBody');
    if(!anchor)throw Error('Body settings panel not found');
    panel=doc.createElement('fieldset');panel.id='customBodyDirectionSettings';
    panel.style.cssText='margin:12px 0;padding:12px;border:1px solid #779;border-radius:8px;';
    panel.innerHTML='<legend>Robot body &amp; forward direction</legend><label>Body type <select data-kind><option value="growbot">Standard GrowBot (original)</option><option value="owlbot">OwlBot eight-servo</option><option value="custom">Custom body</option></select></label><br><label>Forward travel with head centered <select data-travel><option value="native">Original GrowBot behavior</option><option value="screen-forward">Toward screen / selfie view</option><option value="screen-backward">Away from screen / selfie view</option><option value="unknown">Unknown / not calibrated</option></select></label><br><button type="button" data-save>Save body description</button><p data-status role="status"></p><small>Describes the body to the model; does not reverse motors or change calibration. Saved locally for this body ID. This prototype UI/hook disappears on reload; reinstall to use the saved selection.</small>';
    const kind=panel.querySelector('[data-kind]'),travel=panel.querySelector('[data-travel]'),message=panel.querySelector('[data-status]');
    function refresh(){const p=preference();kind.value=p.config.kind;travel.value=p.config.travel;travel.disabled=kind.value==='growbot';message.textContent=p.warning||(p.persisted?'Saved profile loaded.':'Original GrowBot default; no custom selection saved.');}
    kind.addEventListener('change',()=>{travel.disabled=kind.value==='growbot';travel.value=kind.value==='growbot'?'native':kind.value==='owlbot'?'screen-forward':'unknown';});
    panel.querySelector('[data-save]').addEventListener('click',()=>{try{configure({kind:kind.value,travel:travel.value});refresh();message.textContent='Saved and active. Motor commands are unchanged.';}catch(e){message.textContent=e.message;}});
    anchor.parentNode.insertBefore(panel,anchor);refresh();
    return status();
  }
  function uninstall() {
    if (!original) return status();
    if (root.inFlight || root._motion) throw Error('Wait for the current thought/motion to finish');
    if (root.moveGuideText !== wrapper) throw Error('Guide ownership changed; refusing to overwrite another adapter');
    root.moveGuideText = original; original = null; wrapper = null;
    if(panel){panel.remove();panel=null;}
    return status();
  }
  function status() {
    return { version: VERSION, installed: !!original, ownsHook: !!original && root.moveGuideText === wrapper,
      activeForBody: !!original && root.moveGuideText === wrapper && legged(), sessionOnly: true,
      profile:preference().config, preferencePersisted:preference().persisted, warning:preference().warning,
      settingsMounted:!!panel&&panel.isConnected, changesMotorCommands: false, changesStoredIdentity: false };
  }
  return { inspect, correct, install, configure, mountUi, uninstall, status };
});
