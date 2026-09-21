# Pico gait-engine observations and passive serial

The gait samples were extracted passively from existing dog_info replies. They precede the final failed walk; none arrived after that walk began. The retained support_pattern_timeout is an old stop reason and cannot be assigned as the cause of the subsequent communication failure. All are software state, not encoder feedback.

| UTC | Uptime ms | Active / mode | Walking | Cycles / phases / reversals | Last stop | Pose gap / timeout ms | Browser motion | Error present |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 22:27:27.979 | 2306596 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:33.037 | 2311611 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:37.984 | 2316594 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:43.016 | 2321605 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:47.984 | 2326593 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:52.988 | 2331598 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |
| 22:27:57.988 | 2336599 | false / idle | false | 3 / 27 / 0 | support_pattern_timeout | 203 / 1100 | false | false |

## Every passive serial window

[passive-serial-2026-09-21T21-45-27-308134+00-00.json](../evidence/passive-serial-2026-09-21T21-45-27-308134+00-00.json)

```json
{
  "startUtc": "2026-09-21T21:45:27.308134+00:00",
  "duration_s": 45.191,
  "port": "COM5",
  "serialWrites": 0,
  "dtr": false,
  "rts": false,
  "completeLinesObserved": 0,
  "last80SanitizedLines": [],
  "partialLineAtEnd": false,
  "classification": "Not classified automatically; inspect evidence. Silence alone is not a hang."
}
```

[passive-serial-2026-09-21T22-38-21-227551+00-00.json](../evidence/passive-serial-2026-09-21T22-38-21-227551+00-00.json)

```json
{
  "startUtc": "2026-09-21T22:38:21.227551+00:00",
  "duration_s": 45.122,
  "port": "COM5",
  "serialWrites": 0,
  "dtr": false,
  "rts": false,
  "completeLinesObserved": 0,
  "last80SanitizedLines": [],
  "partialLineAtEnd": false,
  "classification": "Not classified automatically; inspect evidence. Silence alone is not a hang."
}
```
