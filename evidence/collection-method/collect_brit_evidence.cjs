// Bounded read-only telemetry. No wake, reconnect, motion, or configuration writes.
const fs=require('node:fs');
const path=require('node:path');
const {evaluate}=require('./growbot_browser_probe.cjs');
const out=path.resolve(__dirname,'../audits/brit-pico-evidence-20260921');
evaluate(`(async()=>{
 const b=_body,w=b?.ws;
 if(!paused||_motion||!w||w.readyState!==1)throw Error('Need paused idle connected GrowBot');
 async function query(fields){
   const rid=++b._rid;
   return await new Promise(resolve=>{
     const done=m=>{clearTimeout(timer);w.removeEventListener('message',receive);resolve(m)};
     const receive=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.t==='ack'&&m.rid===rid)done(m)};
     const timer=setTimeout(()=>done(null),4000);
     w.addEventListener('message',receive);w.send(JSON.stringify({...fields,rid}));
   });
 }
 function cleanController(c){if(!c)return null;
   const r={};for(const k of ['firmware','micropython','uptime_ms','reset_cause','wifi_rssi_dbm','memory_free_bytes'])r[k]=c[k];
   const l=c.link||{};r.link={};for(const k of ['stage','io','heartbeats_sent','pings_sent','failures','connections','radio_resets','close_code'])r.link[k]=l[k];
   const error=e=>['Wi-Fi association did not complete','relay closed the stream','[Errno 104] ECONNRESET'].includes(e)?e:'[unrecognized error text withheld]';
   r.link.faults=(l.faults||[]).map(f=>({at_ms:f.at_ms,stage:f.stage,io:f.io,error:error(f.error)}));return r;
 }
 const startAt=new Date().toISOString(),start=await query({t:'dog_info'});
 const cal=await query({t:'dog_cal',channel_action:'info'});
 const channelSource=cal?.channel_state?.channels;
 const channels=Array.isArray(channelSource)?channelSource.filter(c=>c.enabled).map(c=>({channel:c.channel,name:c.name,enabled:c.enabled,calibrated:c.calibrated})):null;
 const heartbeats=[],sampleStart=Date.now();
 const receive=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.t==='ack'&&m.event==='heartbeat'){
   const frame={t:m.t,rid:m.rid,ok:m.ok,event:m.event,uptime_ms:m.uptime_ms,physical_feedback:m.physical_feedback};
   setTimeout(()=>heartbeats.push({at:new Date().toISOString(),frame,nativeTrafficAgeMs:Date.now()-_bodyRxT}),0);
 }};
 w.addEventListener('message',receive);
 try{await new Promise(r=>setTimeout(r,30000))}finally{w.removeEventListener('message',receive)}
 const end=await query({t:'dog_info'});
 return JSON.stringify({startAt,endAt:new Date().toISOString(),pausedStart:true,pausedEnd:paused,motionEnd:!!_motion,
   controllerStart:cleanController(start?.controller),controllerEnd:cleanController(end?.controller),
   configuredChannels:channels,calibrationReplyReceived:!!cal,heartbeats,
   heartbeatObservationMs:Date.now()-sampleStart,noMotionSent:true,noFirmwareOrSettingsWrites:true});
})()`).then(result=>{
 const parsed=JSON.parse(result);fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'live-telemetry.json'),JSON.stringify(parsed,null,2)+'\n');
 console.log(JSON.stringify(parsed));
}).catch(e=>{console.error(e.message);process.exitCode=1});
