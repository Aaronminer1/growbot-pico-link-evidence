/* Session-only correction for the observed GrowBot _runGait source shape.
 * No website file, Pico firmware, sensor reading, calibration, threshold, duty
 * limit, or Stop handler is changed. Reload discards the patch. Install paused.
 * Reference: https://www.w3.org/TR/orientation-event/#deviceorientation
 */
(function(root,factory){const api=factory(root);if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root.document)root.GrowBotTiltGuard=api;
})(typeof window==='undefined'?globalThis:window,function(root){
  'use strict';
  const version='vertical-vector-0.1';
  let original=null,replacement=null,reference=null,rows=[],summary={},oldCount=0;
  function vertical(o){
    if(!o||typeof o.b!=='number'||typeof o.g!=='number'||!Number.isFinite(o.b)||!Number.isFinite(o.g)||Math.abs(o.b)>180||Math.abs(o.g)>90)return null;
    const b=o.b*Math.PI/180,g=o.g*Math.PI/180;
    // Third row of Rz(alpha)*Rx(beta)*Ry(gamma): world vertical in the
    // device frame. Heading alpha drops out, and beta=90 stays continuous.
    return [-Math.cos(b)*Math.sin(g),Math.sin(b),Math.cos(b)*Math.cos(g)];
  }
  function angle(a,b){
    const x=vertical(a),y=vertical(b);
    // Unusable numbers are NOT evidence that a moving robot is level. Preserve
    // the existing consecutive-sample stop path, without inventing a sensor.
    if(!x||!y)return 180;
    const dot=x[0]*y[0]+x[1]*y[1]+x[2]*y[2];
    const cross=Math.hypot(x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]);
    // atan2 is stable at both zero and 180 degrees (acos amplifies roundoff
    // near identical vectors). Both vectors are unit length by construction.
    return Math.atan2(cross,dot)*180/Math.PI;
  }
  function wrappedDelta(a,b){let d=Math.abs(a-b)%360;return d>180?360-d:d;}
  function measure(o,base){
    if(base!==reference){reference=base;rows=[];oldCount=0;summary={started:Date.now(),samples:0,maxOldDegrees:0,maxVectorDegrees:0,oldAbortWouldFire:false,invalidSamples:0};}
    const value=angle(o,base),old=Math.max(wrappedDelta(o?.b,base?.b),wrappedDelta(o?.g,base?.g)),valid=!!vertical(o)&&!!vertical(base);
    oldCount=old>55?oldCount+1:0;
    summary.samples++;summary.maxOldDegrees=Math.max(summary.maxOldDegrees,Number.isFinite(old)?old:0);
    summary.maxVectorDegrees=Math.max(summary.maxVectorDegrees,value);
    summary.oldAbortWouldFire ||= oldCount>=5;
    if(!valid)summary.invalidSamples++;
    rows.push({at:Date.now(),beta:o?.b,gamma:o?.g,referenceBeta:base?.b,referenceGamma:base?.g,
      oldDegrees:old,vectorDegrees:value,valid,linearMagnitude:root.linMag});
    if(rows.length>400)rows.shift();
    return value;
  }
  function patchedSource(source){
    const pattern=/Math\.max\(angDelta\(ori\.b,upB\.b\),\s*angDelta\(ori\.g,upB\.g\)\)/g;
    if((source.match(pattern)||[]).length!==2||!source.includes('function _runGait(')||
       !source.includes('tipN = dTilt>55 ? tipN+1 : 0;')||!source.includes('if(tipN>=5 || jerkN>=6)')||
       !source.includes('"whoa — I tipped over!"'))throw Error('GrowBot source changed; review before patching');
    let n=0;
    return source.replace(pattern,()=>++n===1?'window.GrowBotTiltGuard.measure(ori,upB)':'window.GrowBotTiltGuard.angle(ori,upB)')
      .replace('"whoa — I tipped over!"','"whoa — my phone angle changed unexpectedly. I stopped to check."');
  }
  function idle(){if(!root.paused||root.inFlight||root._motion||root.GrowBotBodyTools?.status().active)throw Error('Need paused idle GrowBot');}
  function install(){
    idle();if(original)return status();
    const fn=root._runGait;if(typeof fn!=='function')throw Error('Missing native walk function');
    const source=patchedSource(String(fn));
    const compiled=(0,eval)('('+source+')');
    original=fn;replacement=compiled;root._runGait=replacement;
    return status();
  }
  function uninstall(){idle();if(!original)return status();if(root._runGait!==replacement)throw Error('Another change owns the walk function');root._runGait=original;original=null;replacement=null;return status();}
  function status(){return {version,installed:!!original,ownsHook:!!original&&root._runGait===replacement,sessionOnly:true,summary:{...summary}};}
  return {angle,vertical,measure,patchedSource,install,uninstall,status,snapshot:()=>({status:status(),rows:rows.map(r=>({...r}))})};
});
