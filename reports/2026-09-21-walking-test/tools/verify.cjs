// Offline evidence integrity check. Never connects to the phone or controller.
// Run: node tools/verify.cjs ; use --write-manifest only when assembling a package.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const digest = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
const stats = read('appendices/report-statistics.json');
const events = read('appendices/native-events.json');
const attempts = read('appendices/movement-attempts.json');
const protocol = read('appendices/all-protocol-events.json');
const diagnostics = read('appendices/pico-diagnostics.json');
assert.equal(events.length, 566);
assert.equal(attempts.length, 32);
assert.equal(protocol.length, 1209);
assert.equal(diagnostics.length, 283);
assert.equal(stats.captures.reduce((n, c) => n + c.good, 0), 233);
assert.equal(stats.captures.reduce((n, c) => n + c.missed, 0), 49);
assert.equal(stats.captures.reduce((n, c) => n + c.cleanupPending, 0), 1);
assert.equal(stats.captures.reduce((n, c) => n + c.forced, 0), 7);
assert.deepEqual(stats.counts.associationWarnings, []);
const assigned = attempts.flatMap(a => a.lifecycle.map(e => e.eventId));
assert.equal(assigned.length, 113);
assert.equal(new Set(assigned).size, 113);
assert.deepEqual([...assigned].sort(), events.filter(e => e.e === 'action_outcome').map(e => e.id).sort());
for (const [state, count] of Object.entries({completed: 30, blocked: 1, cancelled: 1})) {
  assert.equal(attempts.filter(a => a.terminal === state).length, count);
}
const sourceFiles = read('appendices/source-manifest.json');
assert.equal(sourceFiles.length, 30);
for (const item of sourceFiles) {
  assert.equal(fs.statSync(path.join(root, item.file)).size, item.bytes, item.file);
  assert.equal(digest(item.file), item.sha256, item.file);
}
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const match of readme.matchAll(/\]\((appendices\/[^)]+)\)/g)) {
  assert.ok(fs.existsSync(path.join(root, match[1])), match[1]);
}
function inventory(dir = root) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return inventory(full);
    const file = path.relative(root, full).split(path.sep).join('/');
    return file === 'MANIFEST.json' ? [] : [{file, bytes: fs.statSync(full).size, sha256: digest(file)}];
  }).sort((a, b) => a.file.localeCompare(b.file));
}
const actual = inventory();
if (process.argv.includes('--write-manifest')) {
  fs.writeFileSync(path.join(root, 'MANIFEST.json'), JSON.stringify({
    note: 'SHA-256 inventory of all package files except this manifest itself.',
    files: actual
  }, null, 2) + '\n');
} else {
  assert.deepEqual(read('MANIFEST.json').files, actual, 'Package contents changed');
}
console.log(`PASS: ${actual.length} hashed files; 30 original evidence files; all 113 outcome rows assigned exactly once across 32 attempts; 283 diagnostic results; README appendix links valid.`);
