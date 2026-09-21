/* Scoped Android Chrome debugging helper. Never export URL query parameters,
 * cookies, localStorage, pairing details, camera frames or creature identity.
 * The caller supplies an explicit diagnostic expression; no automatic actions.
 */
async function evaluate(expression) {
  const tabs = await (await fetch('http://127.0.0.1:9223/json/list')).json();
  const targets = tabs.filter(t => {
    try { return new URL(t.url).hostname === 'growbot.dev' && t.type === 'page'; }
    catch { return false; }
  });
  if (targets.length !== 1) throw Error('Exactly one GrowBot page required');
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen=resolve; ws.onerror=()=>reject(Error('Chrome debugging connection failed')); });
  try {
    return await new Promise((resolve, reject) => {
      const timer=setTimeout(()=>reject(Error('GrowBot diagnostic timeout')),45000);
      ws.onmessage=e=>{
        const m=JSON.parse(e.data); if(m.id!==1)return;
        clearTimeout(timer);
        if(m.error || m.result?.exceptionDetails) return reject(Error('GrowBot expression failed: '+
          (m.result?.exceptionDetails?.exception?.description || m.error?.message || 'unknown error')));
        resolve(m.result.result.value);
      };
      ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,returnByValue:true,awaitPromise:true}}));
    });
  } finally { ws.close(); }
}
module.exports={evaluate};
if(require.main===module) evaluate(process.env.GROWBOT_PROBE).then(console.log).catch(e=>{console.error(e.message);process.exitCode=1;});
