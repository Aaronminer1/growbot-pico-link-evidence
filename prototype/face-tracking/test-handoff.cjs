// Offline scheduler, camera and controller substitutes. Runs real arbitration;
// never connects to a phone, network, camera, or servo.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'face-tracker.js'),'utf8');
const a=source.indexOf('  async function loadDetector() {'),b=source.indexOf('  async function refreshBodyBusy()',a);
assert(a>0&&b>a);
const testSource=source.slice(0,a)+'  async function loadDetector(){detector=root.fakeDetector;return detector;}\n'+source.slice(b);
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
function harness(speed=400,implementation='head-speed-400-cadence-v2'){
  let now=10000,id=0,faces=true,delayAck=false,pendingReply=null,blockReads=false,holding=true,readHook=null;
  const timers=new Map(),requests=[],listeners=new Map(),pulses={pan:1500,tilt:855};
  const channels=[{channel:8,a_name:'Left',b_name:'Right',a_us:500,b_us:2500,center_us:1500},
    {channel:9,a_name:'Down',b_name:'Up',a_us:1060,b_us:650,center_us:855}].map(c=>({...c,enabled:true,calibrated:true}));
  const state=()=>({support_enabled:true,max_speed_us_s:speed,head_implementation:implementation,
    config:{pan:{channel:8},tilt:{channel:9}},commanded:{...pulses},targets:{...pulses},moving:false,holding});
  const emit=r=>{for(const fn of listeners.get('message')||[])fn({data:JSON.stringify(r)});};
  const ws={readyState:1,addEventListener(t,f){if(!listeners.has(t))listeners.set(t,new Set());listeners.get(t).add(f);},
    removeEventListener(t,f){listeners.get(t)?.delete(f);},send(data){
      const m=JSON.parse(data);requests.push(m);const r={t:'ack',rid:m.rid,ok:true};
      if(m.channel_action==='head_info'||m.channel_action==='info'){
        if(readHook){const fn=readHook;readHook=null;fn();}
        if(blockReads)return;
      }
      if(m.channel_action==='head_info')r.state=state();
      if(m.channel_action==='info')Object.assign(r,{channel_state:{channels},saved_body_command:{active:false,pan_inverted:true}});
      if(m.body_action==='head'){
        const c=channels[m.axis==='pan'?0:1];pulses[m.axis]=Math.round(c.center_us+m.position*(m.position<0?c.center_us-c.a_us:c.b_us-c.center_us));
        r.state=state();
        if(delayAck){delayAck=false;pendingReply=r;return;}
      }
      if(m.t==='act')pulses.pan=1800;
      queueMicrotask(()=>emit(r));
    }};
  const video={videoWidth:640,videoHeight:480,currentTime:0,
    srcObject:{getVideoTracks:()=>[{readyState:'live',getSettings:()=>({facingMode:'user'})}]}};
  const guide={value:''};
  const root={paused:true,_pauseHard:false,MODE:'legs',_body:{ready:true,ws},
    document:{hidden:false,querySelectorAll:()=>[video],getElementById:()=>guide},
    fakeDetector:{detectForVideo:()=>({detections:faces?[{boundingBox:{originX:400,originY:100,width:100,height:100}}]:[]})},
    moveLegs(){},sendTxtFrom(){},runGait(){},stopMotion(){},setPaused(p){root.paused=p;}};
  class Clock extends Date{static now(){return now;}}
  vm.runInNewContext(testSource,{window:root,Date:Clock,performance:{now:()=>now},
    setTimeout(fn,ms){const n=++id;timers.set(n,{fn,at:now+ms});return n;},clearTimeout(n){timers.delete(n);}});
  return {root,api:root.GrowBotFaceTrack,requests,pulses,
    setFaces(v){faces=v;},delayNext(){delayAck=true;},deliver(){emit(pendingReply);pendingReply=null;},
    blockReads(v){blockReads=v;},setHolding(v){holding=v;},onNextRead(fn){readHook=fn;},
    async advance(ms){now+=ms;video.currentTime+=ms/1000;
      for(const [n,t] of [...timers])if(t.at<=now){timers.delete(n);t.fn();}await flush();},
    moves(){return requests.filter(m=>m.body_action==='head').length;}};
}
(async()=>{
  const h=harness();await h.api.start({mode:'track',durationMs:60000});await flush();
  assert(h.moves()>0);await h.api.look('look left');const held=h.moves();
  for(let i=0;i<30;i++)await h.advance(500);
  assert.equal(h.moves(),held,'timer expiry cannot reclaim a deliberate look');
  assert(h.api.status().attentionHeld);assert(h.api.status().running);h.api.stop();

  const lost=harness();await lost.api.start({mode:'track',durationMs:2000});await flush();
  lost.setFaces(false);const before=lost.moves();await lost.advance(250);await lost.advance(250);
  assert.equal(lost.moves(),before,'no extrapolated commands after a missing face');
  lost.setFaces(true);await lost.advance(250);assert(lost.moves()>before);
  await lost.advance(1500);assert.equal(lost.api.status().running,false);
  const expired=lost.moves();await lost.advance(3000);assert.equal(lost.moves(),expired);
  assert(!lost.requests.some(m=>m.channel_action==='head_stop'),'expiry never releases the load-bearing head');

  const race=harness();race.delayNext();await race.api.start({mode:'track',durationMs:1000});await flush();
  await race.api.look('look right');race.deliver();await flush();
  assert.equal(race.api.status().lastAck.source,'saved look','late face ACK cannot overwrite intentional look evidence');
  await race.advance(1100);assert.equal(race.api.status().running,false,'late ACK must not strand expiry scheduling');

  const resume=harness();resume.root.paused=false;resume.api.installTool();
  await resume.api.start({mode:'coexist',durationMs:60000});await flush();
  await resume.api.look('look left');assert(resume.api.status().attentionHeld);
  resume.root.moveLegs({gesture:'track face'});await resume.advance(250);
  assert.equal(resume.api.status().attentionHeld,false);resume.api.stop();

  // Natural attention shares the same ownership rule, even after multiple
  // automatic-glance scheduling intervals. This is not a powered agent test.
  const natural=harness();natural.root.paused=false;natural.api.installTool();
  await natural.api.start({mode:'attend',durationMs:60000});await flush();
  for(let i=0;i<6;i++)await natural.advance(500);
  assert(natural.moves()>0,'visible face can start an automatic glance');
  natural.root._body.ws.send(JSON.stringify({t:'act',frames:natural.api._test.savedLookFrames('look left')}));
  const beforeNaturalHold=natural.moves();
  for(let i=0;i<40;i++)await natural.advance(500);
  assert(natural.api.status().attentionHeld);
  assert.equal(natural.moves(),beforeNaturalHold,'automatic glance timers cannot undo a deliberate look');
  natural.root.moveLegs({gesture:'track face'});await natural.advance(500);await natural.advance(250);
  assert.equal(natural.api.status().attentionHeld,false);
  assert(natural.moves()>beforeNaturalHold,'explicit tracking choice resumes natural attention');
  natural.api.stop();

  await assert.rejects(harness(400,'unknown').api.preflight(),/speed limit/);
  await assert.rejects(harness(401).api.preflight(),/speed limit/);
  await harness(200,'older').api.preflight();
  // A lost movement ACK enters recovery, not permanent shutdown. Probes are
  // read-only; neither the old target nor the frame from recovery is replayed.
  const timeout=harness();timeout.delayNext();
  await timeout.api.start({mode:'track',durationMs:30000});await flush();
  timeout.setFaces(false);await timeout.advance(3100);
  assert.equal(timeout.api.status().running,true);
  assert.equal(timeout.api.status().recovery.active,true);
  assert.match(timeout.api.status().lastError,/ACK timed out/);
  const stoppedMoves=timeout.moves(),probeStart=timeout.requests.length;
  await timeout.advance(500);
  assert.equal(timeout.api.status().recovery.active,false);
  assert.equal(timeout.api.status().recovery.successes,1);
  assert(timeout.requests.slice(probeStart).every(m=>m.channel_action==='head_info'||m.channel_action==='info'));
  assert.equal(timeout.moves(),stoppedMoves);
  await timeout.advance(250);assert.equal(timeout.moves(),stoppedMoves,'absent face never authorizes replay');
  timeout.setFaces(true);await timeout.advance(250);assert(timeout.moves()>stoppedMoves);
  timeout.deliver();await flush(); // old ACK no longer has a listener
  timeout.api.stop('Operator stop');assert.match(timeout.api.status().lastFault.reason,/ACK timed out/);

  const recoverHeld=harness();recoverHeld.delayNext();
  await recoverHeld.api.start({mode:'track',durationMs:30000});await flush();await recoverHeld.advance(3100);
  await recoverHeld.api.look('look left');const heldMoves=recoverHeld.moves();
  await recoverHeld.advance(500);await recoverHeld.advance(250);
  assert.equal(recoverHeld.moves(),heldMoves);assert(recoverHeld.api.status().attentionHeld);
  recoverHeld.api.stop();

  const expires=harness();expires.delayNext();
  await expires.api.start({mode:'track',durationMs:3500});await flush();await expires.advance(3100);
  const beforeExpiry=expires.requests.length;await expires.advance(500);
  assert.equal(expires.api.status().running,false);assert.match(expires.api.status().lastError,/window ended/);
  assert.equal(expires.requests.length,beforeExpiry,'expiry cannot start a recovery probe');

  for(const action of ['stop','sleep','hide']){
    const cancelledRecovery=harness();cancelledRecovery.delayNext();
    await cancelledRecovery.api.start({mode:'track',durationMs:30000});await flush();await cancelledRecovery.advance(3100);
    cancelledRecovery.onNextRead(()=>{if(action==='stop')cancelledRecovery.api.stop();
      if(action==='sleep')cancelledRecovery.root._pauseHard=true;
      if(action==='hide')cancelledRecovery.root.document.hidden=true;});
    const beforeCancel=cancelledRecovery.moves();await cancelledRecovery.advance(500);await cancelledRecovery.advance(500);
    assert.equal(cancelledRecovery.api.status().running,false);assert.equal(cancelledRecovery.moves(),beforeCancel);
  }

  const exhausted=harness();exhausted.delayNext();
  await exhausted.api.start({mode:'track',durationMs:60000});await flush();await exhausted.advance(3100);
  exhausted.blockReads(true);const beforeExhaustion=exhausted.moves();
  for(let i=0;i<45;i++)await exhausted.advance(500);
  assert.equal(exhausted.api.status().running,false);assert.match(exhausted.api.status().lastError,/recovery exhausted/);
  assert(exhausted.api.status().recovery.attempts<=3);assert.equal(exhausted.moves(),beforeExhaustion);

  const released=harness();released.delayNext();
  await released.api.start({mode:'track',durationMs:30000});await flush();await released.advance(3100);
  released.setHolding(false);await released.advance(500);
  assert.equal(released.api.status().running,false);assert.match(released.api.status().lastError,/support was released/);
  console.log('PASS: handoff, face loss, expiry, bounded read-only recovery, fresh-frame resume, late ACK, deliberate ownership, Stop/Sleep/hidden cancellation and released-support refusal.');
})().catch(e=>{console.error(e);process.exitCode=1;});
