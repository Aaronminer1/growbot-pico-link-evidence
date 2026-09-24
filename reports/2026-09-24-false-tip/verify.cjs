// Offline evidence checks; no browser, controller, network or motion access.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const guard=require('../../prototype/tilt-guard/tilt-guard.js');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'trial.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'SHA256-MANIFEST.json'),'utf8'));
for(const item of manifest.files){
  const bytes=fs.readFileSync(path.join(root,item.path));
  assert.equal(bytes.length,item.bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),item.sha256);
}
let consecutive=0,wouldStop=false,maxOld=0,maxVector=0;
for(const row of data.samples){
  const b=Math.abs(row.beta-row.referenceBeta),g=Math.abs(row.gamma-row.referenceGamma);
  const old=Math.max(Math.min(b,360-b),Math.min(g,360-g));
  const vector=guard.angle({b:row.beta,g:row.gamma},{b:row.referenceBeta,g:row.referenceGamma});
  assert.ok(Math.abs(vector-row.vectorDegrees)<1e-9);
  assert.ok(Math.abs(old-row.oldDegrees)<1e-9);
  consecutive=old>55?consecutive+1:0;wouldStop ||= consecutive>=5;
  maxOld=Math.max(maxOld,old);maxVector=Math.max(maxVector,vector);
}
assert.equal(data.samples.length,253);assert.equal(wouldStop,true);
assert.equal(maxOld,data.summary.maxOldDegrees);assert.equal(maxVector,data.summary.maxVectorDegrees);
assert.equal(data.events.filter(e=>e.event==='walk_start').length,1);
assert.equal(data.events.filter(e=>e.event==='gait_abort').length,0);
assert.equal(data.events.find(e=>e.event==='walk_end').why,'done');
console.log(JSON.stringify({verified:true,samples:data.samples.length,maxOld,maxVector,oldWouldStop:wouldStop,ownerObservation:data.ownerObservation}));
