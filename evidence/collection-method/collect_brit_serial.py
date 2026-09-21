"""Passive 45 s USB observation; no serial writes, REPL, reset, or raw log export.

Only known firmware line formats survive. Unknown lines are represented by a
redaction marker; pairing identifiers, IPs, Wi-Fi names/passwords never leave.
This is deliberately not an unredacted raw serial trace.
"""
import collections
import datetime
import json
from pathlib import Path
import re
import time
import serial

OUT = Path(__file__).resolve().parent.parent / 'audits/brit-pico-evidence-20260921'
def sanitize(line):
    line = line.strip()
    if not line:
        return ''
    if re.search(r'pair|password|ssid|secret|token|authorization|gb-[0-9a-z]+', line, re.I):
        return '[sensitive line redacted]'
    # Narrow formats established by the inspected firmware; no arbitrary exceptions.
    if re.fullmatch(r'(WIFI_FAIL -?\d+|wifi: (starting a fresh association|bouncing the radio|power mode unavailable)|handshake: OK|conn closed by relay|wifi dropped|poses \d+ rate \d+ Hz|re-dial in \d+s \(fail \d+\)|hw watchdog armed(?: before network startup)? \(\d+ms\)|self-heal: machine.reset\(\)|link dead: nothing heard for \d+s, re-dialing)', line):
        return line
    if re.fullmatch(r'(?:loop|read) err: \[Errno -?\d+\] [A-Z0-9_]+', line):
        return line
    if line.startswith('WIFI_OK '):
        return 'WIFI_OK [address redacted]'
    if line.startswith('wifi: True ') or line.startswith('wifi: False '):
        return 'wifi: ' + ('True' if line.startswith('wifi: True ') else 'False') + ' [address omitted]'
    if line.startswith('hello sent;'):
        return 'hello sent [remaining fixed banner omitted]'
    if line.startswith('MicroPython '):
        return '[MicroPython boot banner observed; content withheld]'
    return '[unrecognized line withheld]'

def main():
    lines = collections.deque(maxlen=80)
    count = 0
    start = datetime.datetime.now(datetime.timezone.utc).isoformat()
    port = serial.Serial(port=None, baudrate=115200, timeout=.2)
    port.port = 'COM5'; port.dtr = False; port.rts = False
    port.open()
    began = time.monotonic(); buffer = ''
    try:
        while time.monotonic()-began < 45:
            buffer += port.read(port.in_waiting or 1).decode('utf8','replace')
            while '\n' in buffer:
                line,buffer = buffer.split('\n',1)
                count += 1
                lines.append({'elapsed_s':round(time.monotonic()-began,3),'line':sanitize(line)})
            if len(buffer)>4096:
                buffer='[oversize input withheld]'
    finally:
        port.close()
    result={'startUtc':start,'duration_s':round(time.monotonic()-began,3),
            'port':'COM5','serialWrites':0,'dtr':False,'rts':False,
            'completeLinesObserved':count,'last80SanitizedLines':list(lines),
            'partialLineAtEnd':bool(buffer),'classification':'Not classified automatically; inspect evidence. Silence alone is not a hang.'}
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'passive-serial.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
    print(json.dumps(result))

if __name__=='__main__':
    main()
