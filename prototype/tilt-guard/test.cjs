// Pure math and patch-shape checks. No robot, browser or network access.
const assert=require('node:assert/strict');
const g=require('./tilt-guard.js');
const close=(a,b,eps=1e-6)=>assert(Math.abs(a-b)<eps,`${a} != ${b}`);
close(g.angle({b:89,g:-89},{b:91,g:89}),0.034903041329,1e-6);
close(g.angle({b:90,g:0},{b:90,g:89}),0);
close(g.angle({a:0,b:70,g:15},{a:150,b:70,g:15}),0);
close(g.angle({b:85,g:0},{b:90,g:0}),5);
close(g.angle({b:90,g:0},{b:30,g:0}),60);
close(g.angle({b:90,g:0},{b:0,g:0}),90);
close(g.angle({b:90,g:0},{b:-90,g:0}),180);
for(const bad of [null,{}, {b:null,g:0},{b:NaN,g:0},{b:Infinity,g:0},{b:0,g:91},{b:'90',g:0}])assert.equal(g.angle(bad,{b:90,g:0}),180);
for(let b=-180;b<=180;b+=15)for(let h=-90;h<=90;h+=15){const v=g.vertical({b,g:h});close(Math.hypot(...v),1);close(g.angle({b,g:h},{b,g:h}),0,2e-6);}
const fixture=`function _runGait(spec,attempt){
 if(ori){ var dTilt=Math.max(angDelta(ori.b,upB.b), angDelta(ori.g,upB.g));
 tipN = dTilt>55 ? tipN+1 : 0;
 if(tipN>=5 || jerkN>=6){stopMotion();speak("whoa — I tipped over!");}}
 var _upOk=Math.max(angDelta(ori.b,upB.b),angDelta(ori.g,upB.g))<20;
}`;
const patched=g.patchedSource(fixture);assert(patched.includes('GrowBotTiltGuard.measure(ori,upB)'));assert(patched.includes('GrowBotTiltGuard.angle(ori,upB)<20'));
assert(patched.includes('tipN = dTilt>55 ? tipN+1 : 0;'));assert(patched.includes('if(tipN>=5 || jerkN>=6){stopMotion();'));
assert(!patched.includes('I tipped over!'));assert.throws(()=>g.patchedSource(fixture.replace('dTilt>55','dTilt>99')),/source changed/);
const base={b:89,g:-89};for(let i=0;i<5;i++)g.measure({b:91,g:89},base);
assert(g.status().summary.oldAbortWouldFire);assert(g.status().summary.maxVectorDegrees<.04);
assert.throws(()=>g.install(),/paused/);
console.log('PASS: vertical wrap, yaw, sway, genuine tilt, invalid readings, unit vectors, preserved stop/threshold, source-drift rejection');
