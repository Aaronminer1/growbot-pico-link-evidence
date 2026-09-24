const fs=require('node:fs');
const {evaluate}=require('../../evidence/collection-method/growbot_browser_probe.cjs');
const op=process.argv[2];
async function main(){
 if(op==='install'){
   await evaluate(`(()=>{if(!paused||inFlight||_motion||window.GrowBotBodyTools?.status().active)throw Error('Need paused idle GrowBot');if(window.GrowBotTiltGuard)throw Error('Existing tilt patch; inspect before replacing');return true;})()`);
   return evaluate(fs.readFileSync(__dirname+'/tilt-guard.js','utf8')+'\nGrowBotTiltGuard.install();');
 }
 if(op==='status')return evaluate('GrowBotTiltGuard.status()');
 if(op==='uninstall')return evaluate('GrowBotTiltGuard.uninstall()');
 throw Error('Use install|status|uninstall');
}
main().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
