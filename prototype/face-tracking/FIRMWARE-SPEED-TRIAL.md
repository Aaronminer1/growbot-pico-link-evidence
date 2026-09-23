# Pico head-speed trial, 23 September 2026

The physical cap was raised from **150 to 200 µs/s** only after the owner reported that both face following and saved left/right looks felt too slow. This is a bounded bench trial, not a claim that the phone mount is safe at any higher speed. The shorter 30%-arc discretionary looks and target-lead smoothing are separate phone-side changes. Full 60%-arc firmware looks still use their original extent.

With GrowBot asleep, servo power disconnected, and the Pico USB cable attached, the installed `pico_head.py`, `stock_commands.py`, and `shared_body.py` were copied from the board. Each exactly matched the corresponding pre-trial file in `evidence/firmware-host-copy/`. Only the following constants changed in the local working firmware and on the Pico:

| File | Change |
| --- | --- |
| `pico_head.py` | Initial and per-move `speed`, plus reported `max_speed_us_s`: 150 → 200 |
| `stock_commands.py` | Reported `head_max_speed_us_s`: 150 → 200; sweep-time comment updated |
| `shared_body.py` | Reported `head_max_speed_us_s`: 150 → 200 |

Related local test expectations were updated to derive permitted per-step travel from the configured speed. All 102 head/shared/saved-command tests passed. The three files were uploaded one at a time, copied back, and each read-back SHA-256 matched the edited source. The Pico was reset; relay preflight then reported `max_speed_us_s:200`, head support enabled, and `physical_feedback:false`. No leg or head motor was powered during flashing.

| File | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `pico_head.py` | `71a1b429b7ba342e37c6399ca1fbd70e152408cb84a68020d583981d59ceaab3` | `59c3b4a106926538d1ed6d42123e26c8b62f160835080cee3f0354d4a12d2da3` |
| `stock_commands.py` | `859c136c5ce3b8aea697fa7c570a2f4b34fd643c50483ba08975c5791117483d` | `9d1765c938109d03dfb84f1b7c1dcf77bbd67bb66c2318e2171e0c249c1719e9` |
| `shared_body.py` | `4fcfc249377ecc7b02dbf9576e1a1b1e8648756425d98faa8070c5c87742eb75` | `8078dc255ea8bcc97a833f4f68ea0421ff6b2b0934557ae0b90453447c9288ba` |

Rollback is recoverable: with servo power **off**, restore those exact three pre-trial files from `evidence/firmware-host-copy/` to the Pico, verify hashes, then reset it. Do not edit Wi-Fi or relay secrets as part of this trial. Physical pan smoothness, mount retention, and temperature at 200 µs/s still require an owner-observed powered bench test before calling the change successful.
