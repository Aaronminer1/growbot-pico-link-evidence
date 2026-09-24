// Run with the phone's Chrome remote debugging already forwarded to tcp:9223.
// This helper only injects local JS into the one open growbot.dev tab.
const fs = require('node:fs');
const path = require('node:path');
const {evaluate} = require('../../evidence/collection-method/growbot_browser_probe.cjs');

const command = process.argv[2] || 'status';
const modes = new Set(['observe', 'track', 'coexist', 'attend']);
const source = fs.readFileSync(path.join(__dirname, 'face-tracker.js'), 'utf8');
const inject = `${source}\n//# sourceURL=growbot-stationary-face-tracker.js\n`;

async function run() {
  if (command === 'link-diagnostics') return evaluate(`(async()=>{
    if(!window.paused||window.GrowBotFaceTrack?.status().running)throw Error('Need paused GrowBot with tracking off');
    const samples=[];
    const read=(request)=>new Promise(resolve=>{
      const ws=window._body?.ws,started=Date.now(),rid='head-readonly-'+started+'-'+Math.random();
      if(!ws||ws.readyState!==1)return resolve({request:request.channel_action||request.t,open:false});
      let otherFrames=0,otherAcks=0,done=false;
      const finish=(fields)=>{if(done)return;done=true;clearTimeout(timer);ws.removeEventListener('message',receive);
        resolve({request:request.channel_action||request.t,elapsedMs:Date.now()-started,open:ws.readyState===1,otherFrames,otherAcks,...fields});};
      const receive=event=>{let m;try{m=JSON.parse(event.data);}catch{return;}
        if(m.t!=='ack'||m.rid!==rid){otherFrames++;if(m.t==='ack')otherAcks++;return;}
        const c=m.controller,l=c?.link;
        finish({ack:!!m.ok,controller:c?{uptime_ms:c.uptime_ms,memory_free_bytes:c.memory_free_bytes,
          wifi_rssi_dbm:c.wifi_rssi_dbm,link:{failures:l?.failures,connections:l?.connections,
          radio_resets:l?.radio_resets,heartbeats_sent:l?.heartbeats_sent,faultCount:l?.faults?.length}}:undefined,
          head:m.state?{run_id:m.state.run_id,commanded:m.state.commanded,moving:m.state.moving,holding:m.state.holding}:undefined});};
      const timer=setTimeout(()=>finish({timeout:true}),3000);ws.addEventListener('message',receive);
      try{ws.send(JSON.stringify({...request,rid}));}catch{finish({sendFailed:true});}
    });
    for(let i=0;i<4;i++){
      samples.push(await read({t:'dog_info'}));samples.push(await read({t:'dog_cal',channel_action:'head_info'}));
      await new Promise(r=>setTimeout(r,500));
    }
    return {readOnly:true,paused:window.paused,samples};
  })()`);
  if (command === 'face-loss-test') return evaluate(`(async()=>{
    const tracker=window.GrowBotFaceTrack;
    const check=()=>{if(!window.paused||window._pauseHard||document.hidden)throw Error('Stationary bench state changed');};
    check();if(tracker.status().running)throw Error('Stop previous trial first');
    const before=await tracker.preflight();if(before.bodyBusy)throw Error('Body is busy');
    const started=Date.now(),events=[];let wasVisible=null,seen=false,lostAt=null,lossCount=0,
      longestAbsenceMs=0,absenceSamples=0,commandsDuringAbsence=0,reacquired=false,resumedTargets=false;
    try{
      await tracker.start({mode:'track',durationMs:30000});
      while(tracker.status().running&&Date.now()-started<35000){
        check();const s=tracker.status(),visible=s.faces>0;
        // Recovery clears the cached face; that is not evidence the person
        // physically left. Only fresh camera results count as visibility data.
        if(s.recovery?.active||!s.lastFrameAt||Date.now()-s.lastFrameAt>1000){
          if(lostAt!==null){longestAbsenceMs=Math.max(longestAbsenceMs,Date.now()-lostAt);lostAt=null;}
          wasVisible=null;await new Promise(r=>setTimeout(r,200));continue;
        }
        if(visible!==wasVisible){events.push({elapsedMs:Date.now()-started,visible,trackingCommands:s.trackingCommands});wasVisible=visible;}
        if(visible){
          if(lostAt!==null){longestAbsenceMs=Math.max(longestAbsenceMs,Date.now()-lostAt);reacquired=true;lostAt=null;}
          if(reacquired&&s.trackingCommands>lossCount)resumedTargets=true;
          seen=true;
        }else if(seen){
          if(lostAt===null){lostAt=Date.now();lossCount=s.trackingCommands;}
          else{absenceSamples++;commandsDuringAbsence+=Math.max(0,s.trackingCommands-lossCount);lossCount=s.trackingCommands;}
          longestAbsenceMs=Math.max(longestAbsenceMs,Date.now()-lostAt);
        }
        await new Promise(r=>setTimeout(r,200));
      }
      const ended=tracker.status();if(ended.running)throw Error('Tracking failed to stop within the test deadline');
      const after=await tracker.preflight();
      return {events,longestAbsenceMs,absenceSamples,commandsDuringAbsence,reacquired,resumedTargets,
        elapsedMs:Date.now()-started,trackingCommands:ended.trackingCommands,stopped:!ended.running,
        windowExpired:String(ended.lastError||'').startsWith('Tracking window ended'),reason:ended.lastError,
        recovery:ended.recovery,lastFault:ended.lastFault,
        headAfter:{commanded:after.head.commanded,holding:after.head.holding,moving:after.head.moving},
        bodyBusy:after.bodyBusy,paused:window.paused,physicalFeedback:false};
    }catch(error){tracker.stop('Face loss test stopped: '+error.message);throw error;}
  })()`);
  if (command === 'center-bench') return evaluate('window.GrowBotFaceTrack.benchCenter()');
  if (command === 'handoff-test') return evaluate(`(async()=>{
    const tracker=window.GrowBotFaceTrack;
    if(!tracker||!window.paused||window._pauseHard||document.hidden)throw Error('Need authorized stationary camera/head bench mode');
    const check=()=>{if(!window.paused||window._pauseHard||document.hidden)throw Error('Stationary bench state changed');};
    const before=await tracker.preflight();if(before.bodyBusy)throw Error('Body is busy');
    const started=Date.now(),events=[];
    const sample=label=>{const s=tracker.status();events.push({label,elapsedMs:Date.now()-started,
      running:s.running,faces:s.faces,trackingCommands:s.trackingCommands,attentionHeld:s.attentionHeld,
      yielding:s.yieldingToGrowBot,remainingMs:s.remainingMs,lastError:s.lastError,lastAck:s.lastAck});};
    try {
      await tracker.start({mode:'track',durationMs:30000});
      // A retained ACK from an earlier trial cannot establish this trial.
      const established=()=>{const s=tracker.status();return s.faces>0&&s.trackingCommands>0&&
        s.lastAck?.axis&&s.lastAck.at>=started&&Date.now()-started>=2500;};
      for(let i=0;i<40&&!established();i++){
        check();await new Promise(r=>setTimeout(r,200));
      }
      if(!established())throw Error('Need a currently visible face and a tracking ACK from this trial; handoff not tested');
      sample('tracking-established');check();
      await tracker.look('look left');sample('deliberate-look-accepted');
      const count=tracker.status().trackingCommands;
      const lookAt=Date.now();let visibleAfterYield=0,lastObservedFrame=-1;
      const observeHeld=()=>{const s=tracker.status();
        if(s.running&&s.trackingCommands!==count)throw Error('Tracking reclaimed the deliberate look');
        if(s.running&&Date.now()-lookAt>=12000&&s.faces>0&&s.frames!==lastObservedFrame)visibleAfterYield++;
        lastObservedFrame=s.frames;
      };
      for(let i=0;i<28;i++){check();await new Promise(r=>setTimeout(r,500));}
      sample('after-old-yield-deadline');
      if(tracker.status().trackingCommands!==count)throw Error('Tracking reclaimed the deliberate look');
      if(!tracker.status().attentionHeld)throw Error('Intentional look lost ownership');
      while(tracker.status().running&&Date.now()-started<35000){check();observeHeld();await new Promise(r=>setTimeout(r,250));}
      sample('window-ended');
      if(tracker.status().running)throw Error('Tracking window did not expire');
      const after=await tracker.preflight();
      return {events,visibleFaceSamplesAfterOldYield:visibleAfterYield,
        headAfter:{commanded:after.head.commanded,holding:after.head.holding,moving:after.head.moving},
        bodyBusy:after.bodyBusy,paused:window.paused,modelSelectedLook:false,physicalFeedback:false};
    }catch(error){tracker.stop('Handoff test stopped: '+error.message);throw error;}
  })()`);
  if (command === 'prepare-bench') return evaluate(`(async()=>{
    if(!window.paused||document.hidden)throw Error('Need sleeping foreground GrowBot');
    if(!window._body?.ready||window._body.ws?.readyState!==1)throw Error('Need connected Pico');
    if(!window.__faceBenchPrevious)window.__faceBenchPrevious={hard:window._pauseHard,eye:window.eyeWantOn,facing:window.camFacing};
    // Explicit owner-authorized camera/head-only bench mode. Never call resume:
    // thinking, queued conversation and autonomous legs remain paused.
    window._pauseHard=false;
    if(window.camOn&&window.camFacing!=='user')window.stopCam();
    window.camFacing='user';if(!window.camOn)window.ensureCam();
    for(let i=0;i<30;i++){
      if(!window.paused||document.hidden||window._pauseHard)throw Error('Bench state changed');
      const live=[...document.querySelectorAll('video')].some(v=>v.videoWidth&&v.srcObject?.getVideoTracks().some(t=>t.readyState==='live'&&t.getSettings().facingMode==='user'));
      if(live)return {paused:window.paused,hardPaused:window._pauseHard,cameraReady:true};
      await new Promise(r=>setTimeout(r,200));
    }
    throw Error('Selfie camera did not become ready');
  })()`);
  if (command === 'finish-bench') return evaluate(`(()=>{
    window.GrowBotFaceTrack?.stop('Bench test finished');
    if(!window.paused)throw Error('GrowBot was awakened; leave camera ownership unchanged');
    if(window.camOn)window.stopCam();
    const old=window.__faceBenchPrevious;
    if(old){window._pauseHard=old.hard;window.eyeWantOn=old.eye;window.camFacing=old.facing;delete window.__faceBenchPrevious;}
    // Do not call a body/head stop here: retained PWM supports the mounted phone.
    return {paused:window.paused,hardPaused:window._pauseHard,cameraOn:window.camOn,tracking:window.GrowBotFaceTrack?.status()};
  })()`);
  if (command === 'session') return evaluate(`({hidden:document.hidden,paused:window.paused,hardPaused:window._pauseHard,
    bodyReady:!!window._body?.ready,socketState:window._body?.ws?.readyState,mode:window.MODE,
    tracking:window.GrowBotFaceTrack?.status(),
    videos:[...document.querySelectorAll('video')].map(v=>({width:v.videoWidth,height:v.videoHeight,
      tracks:v.srcObject?.getVideoTracks().map(t=>({state:t.readyState,facing:t.getSettings().facingMode}))}))})`);
  if (command === 'install') return evaluate(`window.GrowBotFaceTrack?.uninstallTool?.();window.GrowBotFaceTrack?.stop?.();(0,eval)(${JSON.stringify(inject)}); GrowBotFaceTrack.installTool()`);
  if (command === 'uninstall') return evaluate('window.GrowBotFaceTrack?.uninstallTool?.() ?? {installed:false}');
  if (command === 'preflight') return evaluate('(async()=>{if(!window.GrowBotFaceTrack)throw Error("Install prototype first");const r=await window.GrowBotFaceTrack.preflight();return {baseline:r.baseline,head:{support_enabled:r.head.support_enabled,max_speed_us_s:r.head.max_speed_us_s,physical_feedback:r.head.physical_feedback}}})()');
  if (command === 'stop') return evaluate('window.GrowBotFaceTrack?.stop() ?? {running:false}');
  if (command === 'status') return evaluate('window.GrowBotFaceTrack?.status() ?? {installed:false}');
  if (command === 'look') {
    const name = 'look ' + process.argv.slice(3).join(' ').replace(/^look\s+/i, '');
    if (!['look left', 'look right', 'look up', 'look down', 'look ahead'].includes(name))
      throw Error('Specify one of the five saved look gestures');
    return evaluate(`window.GrowBotFaceTrack.look(${JSON.stringify(name)})`);
  }
  if (command === 'quicklook') {
    const name = 'look ' + process.argv.slice(3).join(' ').replace(/^look\s+/i, '');
    if (!['look left', 'look right'].includes(name)) throw Error('Specify left or right');
    return evaluate(`window.GrowBotFaceTrack.quickLook(${JSON.stringify(name)})`);
  }
  if (modes.has(command)) {
    const panSign = process.argv[3] === undefined ? -1 : Number(process.argv[3]);
    const tiltSign = process.argv[4] === undefined ? -1 : Number(process.argv[4]);
    if (![panSign, tiltSign].every(x => x === -1 || x === 1)) throw Error('Axis signs must be -1 or 1');
    // Preserve the optional model tool when reinjecting an updated tracker.
    return evaluate(`(async()=>{const hadTool=!!window.GrowBotFaceTrack?.status?.().toolAvailable;window.GrowBotFaceTrack?.uninstallTool?.();window.GrowBotFaceTrack?.stop?.();(0,eval)(${JSON.stringify(inject)});if(hadTool)window.GrowBotFaceTrack.installTool();return await window.GrowBotFaceTrack.start({mode:${JSON.stringify(command)},panSign:${panSign},tiltSign:${tiltSign}})})()`);
  }
  throw Error('Usage: node control.cjs install|uninstall|observe|preflight|track|coexist|attend [panSign tiltSign]|look <left|right|up|down|ahead>|quicklook <left|right>|status|stop');
}
run().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => {console.error(error.message); process.exitCode = 1;});
