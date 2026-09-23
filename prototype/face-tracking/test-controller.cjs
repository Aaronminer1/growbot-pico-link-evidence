// Offline controller contract test. No phone, relay, or servo is contacted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'face-tracker.js'), 'utf8');
const channels = [
  {channel: 8, enabled: true, calibrated: true, a_name: 'Left', b_name: 'Right',
    a_us: 500, b_us: 2500, center_us: 1500},
  {channel: 9, enabled: true, calibrated: true, a_name: 'Down', b_name: 'Up',
    a_us: 1060, b_us: 650, center_us: 855},
];

function harness(onCommand = () => {}) {
  const pulses = {pan: 2000, tilt: 732};
  const commands = [];
  const listeners = new Map();
  const ws = {
    readyState: 1,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    send(data) {
      const request = JSON.parse(data);
      commands.push(request);
      onCommand(request);
      const reply = {t: 'ack', rid: request.rid, ok: true};
      if (request.channel_action === 'head_info') reply.state = {
        support_enabled: true, max_speed_us_s: 150,
        config: {pan: {channel: 8}, tilt: {channel: 9}},
        targets: {...pulses}, moving: false,
      };
      if (request.channel_action === 'info') {
        reply.channel_state = {channels};
        reply.named_walk = {running: false};
        reply.named_turn = {running: false};
      }
      if (request.body_action === 'head')
        pulses[request.axis] = request.axis === 'pan' ? 1500 : 855;
      queueMicrotask(() => {
        for (const fn of listeners.get('message') || []) fn({data: JSON.stringify(reply)});
      });
    },
  };
  const browser = {
    document: {hidden: false, querySelectorAll: () => []},
    paused: false, _pauseHard: false,
    _body: {ready: true, ws},
  };
  vm.runInNewContext(source, {window: browser, setTimeout, clearTimeout,
    performance, console}, {filename: 'face-tracker.js'});
  return {tracker: browser.GrowBotFaceTrack, commands, pulses};
}

(async () => {
  const normal = harness();
  const result = await normal.tracker.headForward();
  assert.equal(result.commandedForward, true);
  assert.equal(result.physicalFeedback, false);
  assert.deepEqual(normal.commands.filter(x => x.body_action === 'head').map(x => [x.axis, x.position]),
    [['pan', 0], ['tilt', 0]]);
  assert.deepEqual(normal.pulses, {pan: 1500, tilt: 855});

  let current = true;
  const cancelled = harness(request => {
    if (request.body_action === 'head') current = false;
  });
  await assert.rejects(cancelled.tracker.headForward(() => current), /cancelled/);
  assert.deepEqual(cancelled.commands.filter(x => x.body_action === 'head').map(x => x.axis), ['pan']);
  console.log('Offline head-forward and cancellation tests passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
