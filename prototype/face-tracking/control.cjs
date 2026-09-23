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
  if (modes.has(command)) {
    const panSign = process.argv[3] === undefined ? -1 : Number(process.argv[3]);
    const tiltSign = process.argv[4] === undefined ? -1 : Number(process.argv[4]);
    if (![panSign, tiltSign].every(x => x === -1 || x === 1)) throw Error('Axis signs must be -1 or 1');
    // Preserve the optional model tool when reinjecting an updated tracker.
    return evaluate(`(async()=>{const hadTool=!!window.GrowBotFaceTrack?.status?.().toolAvailable;window.GrowBotFaceTrack?.uninstallTool?.();window.GrowBotFaceTrack?.stop?.();(0,eval)(${JSON.stringify(inject)});if(hadTool)window.GrowBotFaceTrack.installTool();return await window.GrowBotFaceTrack.start({mode:${JSON.stringify(command)},panSign:${panSign},tiltSign:${tiltSign}})})()`);
  }
  throw Error('Usage: node control.cjs install|uninstall|observe|preflight|track|coexist|attend [panSign tiltSign]|look <left|right|up|down|ahead>|status|stop');
}
run().then(result => console.log(JSON.stringify(result, null, 2))).catch(error => {console.error(error.message); process.exitCode = 1;});
