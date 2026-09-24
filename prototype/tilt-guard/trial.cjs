// Owner-authorized native conversational forward test. Never sends motor
// packets directly. Passive IMU/event capture only; stop observer after trial.
const fs=require('node:fs');
const {evaluate}=require('../../evidence/collection-method/growbot_browser_probe.cjs');
const op=process.argv[2];
const prompt='GrowBot, Aaron confirms you are upright on the floor with clear space ahead and is nearby. Please walk straight forward once for ten seconds at your normal walking setting, then stop and wait for Aaron to judge the movement. Use your actual normal walk action with dir fwd, gait official, secs 10 and say:"". No extra turn, bow, wiggle or second walk. Do not announce that you fell unless a real fall is confirmed.';
const expressions={
start:`(()=>{
 if(!paused||inFlight||_motion||!GrowBotTiltGuard.status().ownsHook||window.GrowBotBodyTools?.status().active)throw Error('Need paused idle patched GrowBot');
 if(window.__tiltTrial)throw Error('Trial already exists; preserve it first');
 const d={started:Date.now(),events:[],active:true},original=window.logEv;
 const keep=['walk_start','walk_end','gait_abort','walk_cancel','motion_refused'];
 const wrapped=function(e,v){if(keep.includes(e)){const keys=['why','dTilt','lin','ask','granted','gait','ms','holding'];d.events.push({at:Date.now(),event:e,...Object.fromEntries(Object.entries(v||{}).filter(([k])=>keys.includes(k)))});}return original.apply(this,arguments);};
 d.stop=()=>{if(window.logEv===wrapped)window.logEv=original;d.active=false;};
 window.__tiltTrial=d;window.logEv=wrapped;setTimeout(d.stop,90000);
 sendTxtFrom(${JSON.stringify(prompt)});setPaused(false);
 return {awake:!paused,requestQueued:true,started:d.started};
})()`,
status:`(()=>({trial:window.__tiltTrial?{started:__tiltTrial.started,events:__tiltTrial.events,active:__tiltTrial.active}:null,
 paused,inFlight,motion:!!_motion,pendingUser:!!window.pendingUser,caption:document.getElementById('say')?.textContent?.slice(0,400),guard:GrowBotTiltGuard.snapshot()}))()`,
stop:`(()=>{window.__tiltTrial?.stop();return {observerStopped:true,guard:GrowBotTiltGuard.status(),awake:!paused};})()`
};
if(!expressions[op])throw Error('Use start|status|stop');
evaluate(expressions[op]).then(r=>{
 if(op==='status'){
   // Keep raw test data local pending explicit field-by-field publication review.
   const file='growbot-tilt-trial-latest.json';fs.writeFileSync(file,JSON.stringify(r,null,2));
   console.log(JSON.stringify({...r,guard:{status:r.guard.status,sampleCount:r.guard.rows.length}},null,2));
 }else console.log(JSON.stringify(r,null,2));
}).catch(e=>{console.error(e.message);process.exitCode=1;});
