const assert = require('node:assert/strict');
const tracker = require('./face-tracker.js')._test;

const selected = tracker.chooseFace([
  {boundingBox: {originX: 5, originY: 5, width: 10, height: 10}},
  {boundingBox: {originX: 80, originY: 20, width: 50, height: 60}},
], null, 240, 320);
assert.ok(selected.cx > 0.4 && selected.cx < 0.5);
assert.equal(tracker.chooseFace([], selected, 240, 320), null);
assert.deepEqual(tracker.nextTarget({pan: 0, tilt: 0}, {cx: 0.5, cy: 0.42}, {panSign: 1, tiltSign: -1}), {pan: 0, tilt: 0});
const next = tracker.nextTarget({pan: 0, tilt: 0}, {cx: 1, cy: 0}, {panSign: 1, tiltSign: -1});
assert.equal(next.pan, 0.026);
assert.equal(next.tilt, 0.13);
assert.equal(tracker.smoothFace({cx: 0.6, cy: 0.4, area: 0.1}, {cx: 0.5, cy: 0.5, area: 0.1}).cx, 0.555);
assert.equal(tracker.toSemantic(1000, {center_us: 1500, a_us: 500, b_us: 2500}), -0.5);
assert.equal(tracker.toSemantic(732, {center_us: 855, a_us: 1060, b_us: 650}), 0.6);
assert.equal(tracker.toSemantic(1000, {center_us: 855, a_us: 1060, b_us: 650}).toFixed(3), '-0.707');
const look = tracker.savedLookFrames('look ahead');
assert.equal(look.length, 8);
assert.deepEqual(look[0], {l: 87, r: 87, ms: 137});
assert.deepEqual(look[3], {l: 97, r: 97, ms: 181});
assert.throws(() => tracker.savedLookFrames('turn right'));
assert.equal(tracker.userFaceIntent('GrowBot, please follow my face!'), 'start');
assert.equal(tracker.userFaceIntent('can you track my face'), 'start');
assert.equal(tracker.userFaceIntent('stop face tracking'), 'stop');
assert.equal(tracker.userFaceIntent('please stop following my face'), 'stop');
assert.equal(tracker.userFaceIntent('why did you not follow my face?'), null);
assert.equal(tracker.speechToggleIntent('motion request speak on'), 'on');
assert.equal(tracker.speechToggleIntent('GrowBot, motion narration off.'), 'off');
assert.equal(tracker.speechToggleIntent('please tell me a story'), null);
assert.equal(tracker.travelDirection({dir: 'forward'}), true);
assert.equal(tracker.travelDirection({dir: 'left'}), true);
assert.equal(tracker.travelDirection({gait: 'spin_right'}), true);
assert.equal(tracker.travelDirection({dir: 'stop'}), false);
assert.deepEqual(tracker.headAim({pan: -0.5, tilt: 0.4}), {pan: 'left', tilt: 'up'});
assert.deepEqual(tracker.headAim({pan: 0, tilt: 0}), {pan: 'ahead', tilt: 'level'});
console.log('Stationary face-tracker pure tests passed');
