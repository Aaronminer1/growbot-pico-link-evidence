# Every captured Pico diagnostic result

All UTC. Full values and source/capture references are in pico-diagnostics.json. A missed query is not a reboot classification. Cleanup-cancelled bench request is not a link failure. Fault sets retain each recorded fault's firmware-relative time, stage, I/O and sanitized error. No new physical sensor measurements are implied.

| Capture / seq | UTC | Result / latency ms | Uptime ms / reset | Free bytes / RSSI dBm | Failures / connections / radio resets | Heartbeats / pings | Stage / I/O | Fault set |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| bench-idle #5 | 21:45:17.941 | ACK OK / 143 | 19132249 / 1 | 24864 / -74 | 10 / 7 / 5 | 3792 / 1904 | serving / dispatch | F01 |
| bench-idle #9 | 21:45:22.953 | ACK OK / 158 | 19137267 / 1 | 280784 / -74 | 10 / 7 / 5 | 3793 / 1904 | serving / dispatch | F01 |
| bench-idle #13 | 21:45:27.970 | ACK OK / 173 | 19142265 / 1 | 236048 / -73 | 10 / 7 / 5 | 3794 / 1905 | serving / dispatch | F01 |
| bench-idle #17 | 21:45:32.928 | ACK OK / 133 | 19147256 / 1 | 191744 / -73 | 10 / 7 / 5 | 3795 / 1905 | serving / dispatch | F01 |
| bench-idle #21 | 21:45:37.927 | ACK OK / 131 | 19152253 / 1 | 147008 / -73 | 10 / 7 / 5 | 3796 / 1906 | serving / dispatch | F01 |
| bench-idle #25 | 21:45:43.023 | ACK OK / 227 | 19157267 / 1 | 102624 / -74 | 10 / 7 / 5 | 3797 / 1906 | serving / dispatch | F01 |
| bench-idle #29 | 21:45:48.041 | ACK OK / 245 | 19162265 / 1 | 57888 / -75 | 10 / 7 / 5 | 3798 / 1907 | serving / dispatch | F01 |
| bench-idle #33 | 21:45:53.053 | ACK OK / 258 | 19167261 / 1 | 13504 / -74 | 10 / 7 / 5 | 3799 / 1907 | serving / dispatch | F01 |
| bench-idle #37 | 21:45:58.076 | ACK OK / 280 | 19172259 / 1 | 280480 / -74 | 10 / 7 / 5 | 3800 / 1908 | serving / dispatch | F01 |
| bench-idle #41 | 21:46:02.796 | capture_stopped_with_request_pending | — | — | — | — | — | — |
| floor-explore-poll-and-watch #5 | 21:58:16.550 | ACK OK / 147 | 555143 / 1 | 24480 / -66 | 3 / 1 / 4 | 95 / 49 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #9 | 21:58:21.540 | ACK OK / 138 | 560150 / 1 | 288416 / -66 | 3 / 1 / 4 | 96 / 49 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #13 | 21:58:26.554 | ACK OK / 150 | 565163 / 1 | 251808 / -66 | 3 / 1 / 4 | 97 / 50 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #18 | 21:58:31.538 | ACK OK / 136 | 570146 / 1 | 215632 / -66 | 3 / 1 / 4 | 98 / 50 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #22 | 21:58:36.547 | ACK OK / 145 | 575151 / 1 | 73792 / -68 | 3 / 1 / 4 | 99 / 51 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #26 | 21:58:41.533 | ACK OK / 130 | 580148 / 1 | 163424 / -68 | 3 / 1 / 4 | 100 / 51 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #30 | 21:58:46.539 | ACK OK / 138 | 585150 / 1 | 64336 / -68 | 3 / 1 / 4 | 101 / 52 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #34 | 21:58:51.551 | ACK OK / 149 | 590158 / 1 | 283216 / -69 | 3 / 1 / 4 | 102 / 52 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #38 | 21:58:56.536 | ACK OK / 134 | 595150 / 1 | 180752 / -68 | 3 / 1 / 4 | 103 / 53 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #42 | 21:59:01.542 | ACK OK / 140 | 600158 / 1 | 74256 / -69 | 3 / 1 / 4 | 104 / 53 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #46 | 21:59:06.549 | ACK OK / 148 | 605162 / 1 | 298208 / -68 | 3 / 1 / 4 | 105 / 54 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #50 | 21:59:11.537 | ACK OK / 135 | 610151 / 1 | 194608 / -68 | 3 / 1 / 4 | 106 / 54 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #54 | 21:59:16.533 | ACK OK / 131 | 615147 / 1 | 88992 / -69 | 3 / 1 / 4 | 107 / 55 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #58 | 21:59:21.557 | ACK OK / 156 | 620167 / 1 | 308656 / -69 | 3 / 1 / 4 | 108 / 55 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #62 | 21:59:26.541 | ACK OK / 139 | 625153 / 1 | 206544 / -68 | 3 / 1 / 4 | 109 / 56 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #66 | 21:59:31.546 | ACK OK / 135 | 630153 / 1 | 103552 / -69 | 3 / 1 / 4 | 110 / 56 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #70 | 21:59:36.559 | ACK OK / 157 | 635152 / 1 | 1600 / -69 | 3 / 1 / 4 | 111 / 57 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #74 | 21:59:41.547 | ACK OK / 146 | 640155 / 1 | 221376 / -70 | 3 / 1 / 4 | 112 / 57 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #79 | 21:59:46.546 | ACK OK / 145 | 645152 / 1 | 118832 / -70 | 3 / 1 / 4 | 113 / 58 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #83 | 21:59:51.561 | ACK OK / 159 | 650158 / 1 | 15408 / -69 | 3 / 1 / 4 | 114 / 58 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #87 | 21:59:56.538 | ACK OK / 137 | 655153 / 1 | 220944 / -69 | 3 / 1 / 4 | 115 / 59 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #91 | 22:00:01.558 | ACK OK / 157 | 660156 / 1 | 115776 / -69 | 3 / 1 / 4 | 116 / 59 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #96 | 22:00:06.567 | ACK OK / 166 | 665156 / 1 | 10240 / -69 | 3 / 1 / 4 | 117 / 60 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #100 | 22:00:11.543 | ACK OK / 142 | 670158 / 1 | 221376 / -68 | 3 / 1 / 4 | 118 / 60 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #104 | 22:00:16.549 | ACK OK / 147 | 675158 / 1 | 119168 / -69 | 3 / 1 / 4 | 119 / 61 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #108 | 22:00:21.564 | ACK OK / 162 | 680154 / 1 | 15408 / -68 | 3 / 1 / 4 | 120 / 61 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #112 | 22:00:26.544 | ACK OK / 142 | 685156 / 1 | 221376 / -69 | 3 / 1 / 4 | 121 / 61 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #116 | 22:00:31.538 | ACK OK / 137 | 690149 / 1 | 118960 / -68 | 3 / 1 / 4 | 122 / 62 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #120 | 22:00:36.574 | ACK OK / 172 | 695154 / 1 | 12704 / -69 | 3 / 1 / 4 | 123 / 62 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #124 | 22:00:41.543 | ACK OK / 129 | 700156 / 1 | 221376 / -69 | 3 / 1 / 4 | 124 / 63 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #128 | 22:00:46.547 | ACK OK / 145 | 705151 / 1 | 119808 / -68 | 3 / 1 / 4 | 125 / 63 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #132 | 22:00:51.558 | ACK OK / 157 | 710150 / 1 | 15872 / -68 | 3 / 1 / 4 | 126 / 64 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #136 | 22:00:56.547 | ACK OK / 145 | 715151 / 1 | 221376 / -68 | 3 / 1 / 4 | 127 / 64 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #140 | 22:01:01.539 | ACK OK / 137 | 720150 / 1 | 112496 / -70 | 3 / 1 / 4 | 128 / 65 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #144 | 22:01:06.564 | ACK OK / 162 | 725154 / 1 | 4128 / -71 | 3 / 1 / 4 | 129 / 65 | serving / dispatch | F02 |
| floor-explore-poll-and-watch #148 | 22:01:11.546 | ACK OK / 145 | 730159 / 1 | 221376 / -70 | 3 / 1 / 4 | 130 / 66 | serving / dispatch | F02 |
| floor-active-exploration #5 | 22:08:10.402 | ACK OK / 129 | 1149013 / 1 | 58768 / -68 | 3 / 1 / 4 | 214 / 108 | serving / dispatch | F03 |
| floor-active-exploration #9 | 22:08:15.410 | ACK OK / 139 | 1154025 / 1 | 22528 / -68 | 3 / 1 / 4 | 215 / 108 | serving / dispatch | F03 |
| floor-active-exploration #13 | 22:08:20.408 | ACK OK / 137 | 1159020 / 1 | 312880 / -67 | 3 / 1 / 4 | 216 / 109 | serving / dispatch | F03 |
| floor-active-exploration #18 | 22:08:25.800 | ACK OK / 529 | 1164408 / 1 | 65168 / -68 | 3 / 1 / 4 | 217 / 109 | serving / dispatch | F03 |
| floor-active-exploration #22 | 22:08:30.407 | ACK OK / 136 | 1169020 / 1 | 145184 / -70 | 3 / 1 / 4 | 218 / 110 | serving / dispatch | F03 |
| floor-active-exploration #26 | 22:08:35.434 | ACK OK / 163 | 1174017 / 1 | 266480 / -67 | 3 / 1 / 4 | 219 / 110 | serving / dispatch | F03 |
| floor-active-exploration #30 | 22:08:40.410 | ACK OK / 139 | 1179016 / 1 | 163696 / -67 | 3 / 1 / 4 | 220 / 111 | serving / dispatch | F03 |
| floor-active-exploration #34 | 22:08:45.405 | ACK OK / 134 | 1184015 / 1 | 56880 / -67 | 3 / 1 / 4 | 221 / 111 | serving / dispatch | F03 |
| floor-active-exploration #38 | 22:08:51.849 | ACK OK / 1577 | 1189232 / 1 | 29008 / -66 | 3 / 1 / 4 | 222 / 112 | serving / dispatch | F03 |
| floor-active-exploration #42 | 22:08:55.415 | ACK OK / 144 | 1194013 / 1 | 124608 / -66 | 3 / 1 / 4 | 223 / 112 | serving / dispatch | F03 |
| floor-active-exploration #46 | 22:09:00.410 | ACK OK / 138 | 1199019 / 1 | 212672 / -67 | 3 / 1 / 4 | 224 / 113 | serving / dispatch | F03 |
| floor-active-exploration #50 | 22:09:05.418 | ACK OK / 147 | 1204019 / 1 | 107904 / -67 | 3 / 1 / 4 | 225 / 113 | serving / dispatch | F03 |
| floor-active-exploration #54 | 22:09:10.423 | ACK OK / 152 | 1209018 / 1 | 1136 / -67 | 3 / 1 / 4 | 226 / 114 | serving / dispatch | F03 |
| floor-active-exploration #59 | 22:09:15.408 | ACK OK / 137 | 1214020 / 1 | 222256 / -67 | 3 / 1 / 4 | 227 / 114 | serving / dispatch | F03 |
| floor-active-exploration #63 | 22:09:20.423 | ACK OK / 152 | 1219020 / 1 | 249504 / -66 | 3 / 1 / 4 | 228 / 115 | serving / dispatch | F03 |
| floor-active-exploration #67 | 22:09:25.482 | ACK OK / 211 | 1224073 / 1 | 14672 / -75 | 3 / 1 / 4 | 229 / 115 | serving / dispatch | F03 |
| floor-active-exploration #71 | 22:09:30.403 | ACK OK / 132 | 1229013 / 1 | 132912 / -71 | 3 / 1 / 4 | 230 / 116 | serving / dispatch | F03 |
| floor-active-exploration #75 | 22:09:35.404 | ACK OK / 133 | 1234013 / 1 | 228944 / -67 | 3 / 1 / 4 | 231 / 116 | serving / dispatch | F03 |
| floor-active-exploration #79 | 22:09:40.412 | ACK OK / 141 | 1239021 / 1 | 225312 / -66 | 3 / 1 / 4 | 232 / 117 | serving / dispatch | F03 |
| floor-active-exploration #83 | 22:09:45.399 | ACK OK / 128 | 1244013 / 1 | 125088 / -66 | 3 / 1 / 4 | 233 / 117 | serving / dispatch | F03 |
| floor-active-exploration #87 | 22:09:50.398 | ACK OK / 127 | 1249013 / 1 | 311392 / -68 | 3 / 1 / 4 | 234 / 118 | serving / dispatch | F03 |
| floor-active-exploration #91 | 22:09:55.408 | ACK OK / 137 | 1254020 / 1 | 275152 / -69 | 3 / 1 / 4 | 235 / 118 | serving / dispatch | F03 |
| floor-active-exploration #95 | 22:10:00.424 | ACK OK / 153 | 1259023 / 1 | 238528 / -68 | 3 / 1 / 4 | 236 / 119 | serving / dispatch | F03 |
| floor-active-exploration #99 | 22:10:05.417 | ACK OK / 146 | 1264021 / 1 | 202288 / -68 | 3 / 1 / 4 | 237 / 119 | serving / dispatch | F03 |
| floor-active-exploration #103 | 22:10:10.388 | ACK OK / 117 | 1269006 / 1 | 165712 / -67 | 3 / 1 / 4 | 238 / 120 | serving / dispatch | F03 |
| floor-active-exploration #107 | 22:10:15.395 | ACK OK / 124 | 1274010 / 1 | 129472 / -67 | 3 / 1 / 4 | 239 / 120 | serving / dispatch | F03 |
| floor-active-exploration #111 | 22:10:20.469 | ACK OK / 197 | 1279024 / 1 | 92800 / -66 | 3 / 1 / 4 | 240 / 121 | serving / dispatch | F03 |
| floor-active-exploration #115 | 22:10:25.432 | ACK OK / 133 | 1284040 / 1 | 56512 / -67 | 3 / 1 / 4 | 241 / 121 | serving / dispatch | F03 |
| floor-active-exploration #119 | 22:10:30.503 | ACK OK / 232 | 1289023 / 1 | 19936 / -66 | 3 / 1 / 4 | 242 / 122 | serving / dispatch | F03 |
| floor-active-exploration #123 | 22:10:35.420 | ACK OK / 149 | 1294012 / 1 | 288400 / -68 | 3 / 1 / 4 | 243 / 122 | serving / dispatch | F03 |
| floor-active-exploration #127 | 22:10:40.405 | ACK OK / 134 | 1299010 / 1 | 251776 / -68 | 3 / 1 / 4 | 244 / 123 | serving / dispatch | F03 |
| floor-active-exploration #131 | 22:10:45.401 | ACK OK / 130 | 1304015 / 1 | 215536 / -67 | 3 / 1 / 4 | 245 / 123 | serving / dispatch | F03 |
| floor-active-exploration #136 | 22:10:50.460 | ACK OK / 187 | 1309024 / 1 | 178912 / -68 | 3 / 1 / 4 | 246 / 124 | serving / dispatch | F03 |
| floor-active-exploration #140 | 22:10:55.414 | ACK OK / 143 | 1314013 / 1 | 24192 / -67 | 3 / 1 / 4 | 247 / 124 | serving / dispatch | F03 |
| floor-active-exploration #144 | 22:11:00.414 | ACK OK / 143 | 1319021 / 1 | 275712 / -67 | 3 / 1 / 4 | 248 / 125 | serving / dispatch | F03 |
| floor-active-exploration #148 | 22:11:05.411 | ACK OK / 140 | 1324021 / 1 | 231568 / -67 | 3 / 1 / 4 | 249 / 125 | serving / dispatch | F03 |
| floor-active-exploration #152 | 22:11:10.405 | ACK OK / 134 | 1329021 / 1 | 187072 / -66 | 3 / 1 / 4 | 250 / 126 | serving / dispatch | F03 |
| floor-active-exploration #156 | 22:11:15.395 | ACK OK / 124 | 1334012 / 1 | 143008 / -67 | 3 / 1 / 4 | 251 / 126 | serving / dispatch | F03 |
| floor-active-exploration #160 | 22:11:20.417 | ACK OK / 146 | 1339015 / 1 | 98512 / -68 | 3 / 1 / 4 | 252 / 127 | serving / dispatch | F03 |
| floor-active-exploration #165 | 22:11:25.408 | ACK OK / 137 | 1344021 / 1 | 54368 / -66 | 3 / 1 / 4 | 253 / 127 | serving / dispatch | F03 |
| floor-active-exploration #169 | 22:11:30.428 | ACK OK / 157 | 1349022 / 1 | 9872 / -67 | 3 / 1 / 4 | 254 / 128 | serving / dispatch | F03 |
| floor-active-exploration #173 | 22:11:35.408 | ACK OK / 137 | 1354019 / 1 | 280480 / -67 | 3 / 1 / 4 | 255 / 128 | serving / dispatch | F03 |
| floor-active-exploration #177 | 22:11:40.455 | ACK OK / 184 | 1359027 / 1 | 235952 / -67 | 3 / 1 / 4 | 256 / 129 | serving / dispatch | F03 |
| floor-active-exploration #181 | 22:11:45.401 | ACK OK / 130 | 1364020 / 1 | 191888 / -67 | 3 / 1 / 4 | 257 / 129 | serving / dispatch | F03 |
| floor-active-exploration #185 | 22:11:50.437 | ACK OK / 166 | 1369051 / 1 | 147232 / -67 | 3 / 1 / 4 | 258 / 130 | serving / dispatch | F03 |
| floor-active-exploration #189 | 22:11:55.414 | ACK OK / 143 | 1374026 / 1 | 103248 / -67 | 3 / 1 / 4 | 259 / 130 | serving / dispatch | F03 |
| floor-active-exploration #193 | 22:12:00.420 | ACK OK / 149 | 1379035 / 1 | 58752 / -67 | 3 / 1 / 4 | 260 / 131 | serving / dispatch | F03 |
| floor-active-exploration #197 | 22:12:05.429 | ACK OK / 158 | 1384023 / 1 | 14688 / -67 | 3 / 1 / 4 | 261 / 131 | serving / dispatch | F03 |
| floor-active-exploration #201 | 22:12:10.401 | ACK OK / 130 | 1389012 / 1 | 280176 / -66 | 3 / 1 / 4 | 262 / 132 | serving / dispatch | F03 |
| floor-active-exploration #205 | 22:12:15.411 | ACK OK / 139 | 1394022 / 1 | 236032 / -67 | 3 / 1 / 4 | 263 / 132 | serving / dispatch | F03 |
| floor-active-exploration #209 | 22:12:20.412 | ACK OK / 141 | 1399026 / 1 | 191504 / -67 | 3 / 1 / 4 | 264 / 133 | serving / dispatch | F03 |
| floor-active-exploration #213 | 22:12:25.417 | ACK OK / 146 | 1404032 / 1 | 147360 / -67 | 3 / 1 / 4 | 265 / 133 | serving / dispatch | F03 |
| floor-active-exploration #218 | 22:12:30.399 | ACK OK / 128 | 1409014 / 1 | 102944 / -67 | 3 / 1 / 4 | 266 / 134 | serving / dispatch | F03 |
| floor-active-exploration #222 | 22:12:35.412 | ACK OK / 141 | 1414026 / 1 | 253168 / -66 | 3 / 1 / 4 | 267 / 134 | serving / dispatch | F03 |
| floor-active-exploration #226 | 22:12:40.423 | ACK OK / 152 | 1419016 / 1 | 27200 / -69 | 3 / 1 / 4 | 268 / 135 | serving / dispatch | F03 |
| floor-active-exploration #230 | 22:12:45.400 | ACK OK / 129 | 1424010 / 1 | 320288 / -71 | 3 / 1 / 4 | 269 / 135 | serving / dispatch | F03 |
| floor-active-exploration #234 | 22:12:50.415 | ACK OK / 144 | 1429027 / 1 | 215984 / -70 | 3 / 1 / 4 | 270 / 136 | serving / dispatch | F03 |
| floor-active-exploration #238 | 22:12:55.420 | ACK OK / 146 | 1434023 / 1 | 115664 / -73 | 3 / 1 / 4 | 271 / 136 | serving / dispatch | F03 |
| floor-active-exploration #243 | 22:13:00.425 | ACK OK / 154 | 1439016 / 1 | 10656 / -71 | 3 / 1 / 4 | 272 / 137 | serving / dispatch | F03 |
| floor-active-exploration #247 | 22:13:05.414 | ACK OK / 143 | 1444021 / 1 | 220128 / -71 | 3 / 1 / 4 | 273 / 137 | serving / dispatch | F03 |
| floor-active-exploration #251 | 22:13:10.409 | ACK OK / 138 | 1449024 / 1 | 115840 / -71 | 3 / 1 / 4 | 274 / 138 | serving / dispatch | F03 |
| floor-active-exploration #255 | 22:13:15.433 | ACK OK / 162 | 1454024 / 1 | 20352 / -71 | 3 / 1 / 4 | 275 / 138 | serving / dispatch | F03 |
| floor-active-exploration #259 | 22:13:20.434 | ACK OK / 163 | 1459023 / 1 | 226576 / -71 | 3 / 1 / 4 | 276 / 139 | serving / dispatch | F03 |
| floor-active-exploration #263 | 22:13:25.457 | ACK OK / 133 | 1464063 / 1 | 119584 / -72 | 3 / 1 / 4 | 277 / 139 | serving / dispatch | F03 |
| floor-active-exploration #267 | 22:13:30.426 | ACK OK / 155 | 1469019 / 1 | 21360 / -72 | 3 / 1 / 4 | 278 / 140 | serving / dispatch | F03 |
| floor-active-exploration #271 | 22:13:35.410 | ACK OK / 138 | 1474020 / 1 | 222576 / -71 | 3 / 1 / 4 | 279 / 140 | serving / dispatch | F03 |
| floor-active-exploration #276 | 22:13:40.406 | ACK OK / 135 | 1479019 / 1 | 81008 / -71 | 3 / 1 / 4 | 280 / 141 | serving / dispatch | F03 |
| floor-active-exploration #280 | 22:13:45.408 | ACK OK / 137 | 1484014 / 1 | 246416 / -74 | 3 / 1 / 4 | 281 / 141 | serving / dispatch | F03 |
| floor-active-exploration #284 | 22:13:50.395 | ACK OK / 124 | 1489011 / 1 | 58864 / -73 | 3 / 1 / 4 | 282 / 142 | serving / dispatch | F03 |
| floor-active-exploration #288 | 22:13:55.400 | ACK OK / 129 | 1494013 / 1 | 278416 / -74 | 3 / 1 / 4 | 283 / 142 | serving / dispatch | F03 |
| floor-active-exploration #292 | 22:14:00.401 | ACK OK / 130 | 1499012 / 1 | 176368 / -73 | 3 / 1 / 4 | 284 / 143 | serving / dispatch | F03 |
| floor-active-exploration #296 | 22:14:05.411 | ACK OK / 140 | 1504027 / 1 | 76048 / -73 | 3 / 1 / 4 | 285 / 143 | serving / dispatch | F03 |
| sustained-explore-repro-01 #5 | 22:19:08.022 | ACK OK / 166 | 1806612 / 1 | 2352 / -69 | 3 / 1 / 4 | 345 / 173 | serving / dispatch | F04 |
| sustained-explore-repro-01 #9 | 22:19:12.998 | ACK OK / 145 | 1811611 / 1 | 218496 / -68 | 3 / 1 / 4 | 346 / 174 | serving / dispatch | F04 |
| sustained-explore-repro-01 #13 | 22:19:17.997 | ACK OK / 144 | 1816609 / 1 | 108448 / -68 | 3 / 1 / 4 | 347 / 174 | serving / dispatch | F04 |
| sustained-explore-repro-01 #18 | 22:19:23.017 | ACK OK / 164 | 1821608 / 1 | 320 / -68 | 3 / 1 / 4 | 348 / 175 | serving / dispatch | F04 |
| sustained-explore-repro-01 #22 | 22:19:27.988 | ACK OK / 135 | 1826605 / 1 | 140624 / -68 | 3 / 1 / 4 | 349 / 175 | serving / dispatch | F04 |
| sustained-explore-repro-01 #26 | 22:19:33.024 | ACK OK / 170 | 1831604 / 1 | 46784 / -71 | 3 / 1 / 4 | 350 / 176 | serving / dispatch | F04 |
| sustained-explore-repro-01 #30 | 22:19:38.033 | ACK OK / 180 | 1836602 / 1 | 2640 / -70 | 3 / 1 / 4 | 351 / 176 | serving / dispatch | F04 |
| sustained-explore-repro-01 #34 | 22:19:43.033 | ACK OK / 180 | 1841602 / 1 | 280096 / -71 | 3 / 1 / 4 | 352 / 177 | serving / dispatch | F04 |
| sustained-explore-repro-01 #38 | 22:19:47.997 | ACK OK / 144 | 1846605 / 1 | 235952 / -69 | 3 / 1 / 4 | 353 / 177 | serving / dispatch | F04 |
| sustained-explore-repro-01 #42 | 22:19:53.096 | ACK OK / 243 | 1851603 / 1 | 191456 / -69 | 3 / 1 / 4 | 354 / 178 | serving / dispatch | F04 |
| sustained-explore-repro-01 #46 | 22:19:57.982 | ACK OK / 128 | 1856596 / 1 | 147392 / -69 | 3 / 1 / 4 | 355 / 178 | serving / dispatch | F04 |
| sustained-explore-repro-01 #50 | 22:20:02.986 | ACK OK / 131 | 1861600 / 1 | 102896 / -69 | 3 / 1 / 4 | 356 / 179 | serving / dispatch | F04 |
| sustained-explore-repro-01 #54 | 22:20:07.978 | ACK OK / 125 | 1866594 / 1 | 58832 / -68 | 3 / 1 / 4 | 357 / 179 | serving / dispatch | F04 |
| sustained-explore-repro-01 #58 | 22:20:13.062 | ACK OK / 209 | 1871601 / 1 | 14336 / -68 | 3 / 1 / 4 | 358 / 180 | serving / dispatch | F04 |
| sustained-explore-repro-01 #62 | 22:20:18.080 | ACK OK / 227 | 1876617 / 1 | 280400 / -68 | 3 / 1 / 4 | 359 / 180 | serving / dispatch | F04 |
| sustained-explore-repro-01 #66 | 22:20:22.993 | ACK OK / 139 | 1881596 / 1 | 235984 / -68 | 3 / 1 / 4 | 360 / 181 | serving / dispatch | F04 |
| sustained-explore-repro-01 #70 | 22:20:27.999 | ACK OK / 145 | 1886610 / 1 | 191840 / -68 | 3 / 1 / 4 | 361 / 181 | serving / dispatch | F04 |
| sustained-explore-repro-01 #74 | 22:20:32.982 | ACK OK / 129 | 1891589 / 1 | 66752 / -71 | 3 / 1 / 4 | 362 / 182 | serving / dispatch | F04 |
| sustained-explore-repro-01 #78 | 22:20:38.003 | ACK OK / 144 | 1896613 / 1 | 315472 / -72 | 3 / 1 / 4 | 363 / 182 | serving / dispatch | F04 |
| sustained-explore-repro-01 #82 | 22:20:43.003 | ACK OK / 150 | 1901608 / 1 | 271024 / -72 | 3 / 1 / 4 | 364 / 183 | serving / dispatch | F04 |
| sustained-explore-repro-01 #86 | 22:20:47.984 | ACK OK / 131 | 1906594 / 1 | 226960 / -71 | 3 / 1 / 4 | 365 / 183 | serving / dispatch | F04 |
| sustained-explore-repro-01 #91 | 22:20:52.978 | ACK OK / 125 | 1911592 / 1 | 182464 / -71 | 3 / 1 / 4 | 366 / 184 | serving / dispatch | F04 |
| sustained-explore-repro-01 #95 | 22:20:58.003 | ACK OK / 150 | 1916599 / 1 | 132240 / -70 | 3 / 1 / 4 | 367 / 184 | serving / dispatch | F04 |
| sustained-explore-repro-01 #99 | 22:21:02.988 | ACK OK / 135 | 1921598 / 1 | 227664 / -70 | 3 / 1 / 4 | 368 / 185 | serving / dispatch | F04 |
| sustained-explore-repro-01 #103 | 22:21:08.049 | ACK OK / 196 | 1926619 / 1 | 278720 / -69 | 3 / 1 / 4 | 369 / 185 | serving / dispatch | F04 |
| sustained-explore-repro-01 #107 | 22:21:13.008 | ACK OK / 155 | 1931620 / 1 | 177952 / -70 | 3 / 1 / 4 | 370 / 186 | serving / dispatch | F04 |
| sustained-explore-repro-01 #111 | 22:21:18.001 | ACK OK / 148 | 1936615 / 1 | 83088 / -70 | 3 / 1 / 4 | 371 / 186 | serving / dispatch | F04 |
| sustained-explore-repro-01 #116 | 22:21:23.018 | ACK OK / 165 | 1941628 / 1 | 308112 / -71 | 3 / 1 / 4 | 372 / 187 | serving / dispatch | F04 |
| sustained-explore-repro-01 #120 | 22:21:27.998 | ACK OK / 145 | 1946610 / 1 | 204320 / -71 | 3 / 1 / 4 | 373 / 187 | serving / dispatch | F04 |
| sustained-explore-repro-01 #124 | 22:21:32.997 | ACK OK / 144 | 1951611 / 1 | 102352 / -69 | 3 / 1 / 4 | 374 / 188 | serving / dispatch | F04 |
| sustained-explore-repro-01 #128 | 22:21:38.031 | ACK OK / 178 | 1956628 / 1 | 4608 / -70 | 3 / 1 / 4 | 375 / 188 | serving / dispatch | F04 |
| sustained-explore-repro-01 #132 | 22:21:42.999 | ACK OK / 145 | 1961611 / 1 | 222096 / -71 | 3 / 1 / 4 | 376 / 189 | serving / dispatch | F04 |
| sustained-explore-repro-01 #136 | 22:21:47.997 | ACK OK / 144 | 1966604 / 1 | 206048 / -72 | 3 / 1 / 4 | 377 / 189 | serving / dispatch | F04 |
| sustained-explore-repro-01 #141 | 22:21:52.987 | ACK OK / 134 | 1971594 / 1 | 79696 / -70 | 3 / 1 / 4 | 378 / 190 | serving / dispatch | F04 |
| sustained-explore-repro-01 #145 | 22:21:57.978 | ACK OK / 123 | 1976594 / 1 | 35552 / -72 | 3 / 1 / 4 | 379 / 190 | serving / dispatch | F04 |
| sustained-explore-repro-01 #149 | 22:22:02.989 | ACK OK / 136 | 1981602 / 1 | 317776 / -71 | 3 / 1 / 4 | 380 / 191 | serving / dispatch | F04 |
| sustained-explore-repro-01 #153 | 22:22:07.978 | ACK OK / 125 | 1986593 / 1 | 273712 / -71 | 3 / 1 / 4 | 381 / 191 | serving / dispatch | F04 |
| sustained-explore-repro-01 #157 | 22:22:12.981 | ACK OK / 128 | 1991595 / 1 | 229216 / -71 | 3 / 1 / 4 | 382 / 192 | serving / dispatch | F04 |
| sustained-explore-repro-01 #162 | 22:22:17.992 | ACK OK / 139 | 1996607 / 1 | 185072 / -71 | 3 / 1 / 4 | 383 / 192 | serving / dispatch | F04 |
| sustained-explore-repro-01 #166 | 22:22:22.981 | ACK OK / 128 | 2001592 / 1 | 140656 / -71 | 3 / 1 / 4 | 384 / 193 | serving / dispatch | F04 |
| sustained-explore-repro-01 #170 | 22:22:27.996 | ACK OK / 143 | 2006605 / 1 | 96512 / -71 | 3 / 1 / 4 | 385 / 193 | serving / dispatch | F04 |
| sustained-explore-repro-01 #174 | 22:22:32.992 | ACK OK / 139 | 2011606 / 1 | 52016 / -71 | 3 / 1 / 4 | 386 / 194 | serving / dispatch | F04 |
| sustained-explore-repro-01 #179 | 22:22:38.164 | ACK OK / 301 | 2016663 / 1 | 7632 / -73 | 3 / 1 / 4 | 387 / 194 | serving / dispatch | F04 |
| sustained-explore-repro-01 #183 | 22:22:43.009 | ACK OK / 156 | 2021612 / 1 | 280368 / -71 | 3 / 1 / 4 | 388 / 195 | serving / dispatch | F04 |
| sustained-explore-repro-01 #188 | 22:22:48.286 | ACK OK / 432 | 2026903 / 1 | 129344 / -72 | 3 / 1 / 4 | 389 / 195 | serving / dispatch | F04 |
| sustained-explore-repro-01 #192 | 22:22:52.998 | ACK OK / 145 | 2031601 / 1 | 139648 / -70 | 3 / 1 / 4 | 390 / 196 | serving / dispatch | F04 |
| sustained-explore-repro-01 #196 | 22:22:58.020 | ACK OK / 167 | 2036635 / 1 | 146400 / -68 | 3 / 1 / 4 | 391 / 196 | serving / dispatch | F04 |
| sustained-explore-repro-01 #200 | 22:23:03.018 | ACK OK / 165 | 2041633 / 1 | 38096 / -68 | 3 / 1 / 4 | 392 / 197 | serving / dispatch | F04 |
| sustained-explore-repro-01 #204 | 22:23:08.039 | ACK OK / 186 | 2046645 / 1 | 254976 / -69 | 3 / 1 / 4 | 393 / 197 | serving / dispatch | F04 |
| sustained-explore-repro-01 #209 | 22:23:13.041 | ACK OK / 188 | 2051646 / 1 | 147056 / -69 | 3 / 1 / 4 | 394 / 198 | serving / dispatch | F04 |
| sustained-explore-repro-01 #213 | 22:23:18.024 | ACK OK / 171 | 2056633 / 1 | 41856 / -69 | 3 / 1 / 4 | 395 / 198 | serving / dispatch | F04 |
| sustained-explore-repro-01 #217 | 22:23:23.022 | ACK OK / 169 | 2061633 / 1 | 262160 / -68 | 3 / 1 / 4 | 396 / 199 | serving / dispatch | F04 |
| sustained-explore-repro-01 #221 | 22:23:28.014 | ACK OK / 161 | 2066629 / 1 | 162096 / -69 | 3 / 1 / 4 | 397 / 199 | serving / dispatch | F04 |
| sustained-explore-repro-01 #225 | 22:23:32.989 | ACK OK / 135 | 2071597 / 1 | 80944 / -68 | 3 / 1 / 4 | 398 / 200 | serving / dispatch | F04 |
| sustained-explore-repro-01 #229 | 22:23:37.987 | ACK OK / 134 | 2076598 / 1 | 268704 / -71 | 3 / 1 / 4 | 399 / 200 | serving / dispatch | F04 |
| sustained-explore-repro-01 #234 | 22:23:42.989 | ACK OK / 135 | 2081600 / 1 | 224144 / -72 | 3 / 1 / 4 | 400 / 201 | serving / dispatch | F04 |
| sustained-explore-repro-01 #238 | 22:23:47.985 | ACK OK / 132 | 2086596 / 1 | 131648 / -72 | 3 / 1 / 4 | 401 / 201 | serving / dispatch | F04 |
| sustained-explore-repro-01 #242 | 22:23:53.001 | ACK OK / 147 | 2091598 / 1 | 20864 / -73 | 3 / 1 / 4 | 402 / 202 | serving / dispatch | F04 |
| sustained-explore-repro-01 #246 | 22:23:58.011 | ACK OK / 158 | 2096624 / 1 | 280416 / -74 | 3 / 1 / 4 | 403 / 202 | serving / dispatch | F04 |
| sustained-explore-repro-01 #250 | 22:24:02.978 | ACK OK / 125 | 2101594 / 1 | 236064 / -74 | 3 / 1 / 4 | 404 / 203 | serving / dispatch | F04 |
| sustained-explore-repro-01 #255 | 22:24:07.981 | ACK OK / 128 | 2106593 / 1 | 191936 / -73 | 3 / 1 / 4 | 405 / 203 | serving / dispatch | F04 |
| sustained-explore-repro-01 #259 | 22:24:13.091 | ACK OK / 238 | 2111606 / 1 | 147376 / -74 | 3 / 1 / 4 | 406 / 204 | serving / dispatch | F04 |
| sustained-explore-repro-01 #263 | 22:24:18.065 | ACK OK / 212 | 2116595 / 1 | 103328 / -73 | 3 / 1 / 4 | 407 / 204 | serving / dispatch | F04 |
| sustained-explore-repro-01 #267 | 22:24:22.988 | ACK OK / 135 | 2121604 / 1 | 58848 / -74 | 3 / 1 / 4 | 408 / 205 | serving / dispatch | F04 |
| sustained-explore-repro-01 #271 | 22:24:28.040 | ACK OK / 187 | 2126594 / 1 | 14800 / -74 | 3 / 1 / 4 | 409 / 205 | serving / dispatch | F04 |
| sustained-explore-repro-01 #276 | 22:24:32.987 | ACK OK / 133 | 2131597 / 1 | 280144 / -74 | 3 / 1 / 4 | 410 / 206 | serving / dispatch | F04 |
| sustained-explore-repro-01 #280 | 22:24:37.981 | ACK OK / 127 | 2136596 / 1 | 161984 / -75 | 3 / 1 / 4 | 411 / 206 | serving / dispatch | F04 |
| sustained-explore-repro-01 #284 | 22:24:43.016 | ACK OK / 162 | 2141611 / 1 | 247632 / -74 | 3 / 1 / 4 | 412 / 207 | serving / dispatch | F04 |
| sustained-explore-repro-01 #288 | 22:24:47.997 | ACK OK / 143 | 2146609 / 1 | 276656 / -71 | 3 / 1 / 4 | 413 / 207 | serving / dispatch | F04 |
| sustained-explore-repro-01 #292 | 22:24:52.983 | ACK OK / 130 | 2151599 / 1 | 175408 / -70 | 3 / 1 / 4 | 414 / 208 | serving / dispatch | F04 |
| sustained-explore-repro-01 #297 | 22:24:57.997 | ACK OK / 143 | 2156600 / 1 | 70608 / -75 | 3 / 1 / 4 | 415 / 208 | serving / dispatch | F04 |
| sustained-explore-repro-01 #301 | 22:25:03.000 | ACK OK / 147 | 2161612 / 1 | 295024 / -76 | 3 / 1 / 4 | 416 / 209 | serving / dispatch | F04 |
| sustained-explore-repro-01 #305 | 22:25:07.999 | ACK OK / 146 | 2166601 / 1 | 194160 / -76 | 3 / 1 / 4 | 417 / 209 | serving / dispatch | F04 |
| sustained-explore-repro-01 #309 | 22:25:12.982 | ACK OK / 129 | 2171594 / 1 | 89888 / -75 | 3 / 1 / 4 | 418 / 210 | serving / dispatch | F04 |
| sustained-explore-repro-01 #313 | 22:25:17.986 | ACK OK / 133 | 2176598 / 1 | 318480 / -74 | 3 / 1 / 4 | 419 / 210 | serving / dispatch | F04 |
| sustained-explore-repro-01 #318 | 22:25:22.992 | ACK OK / 139 | 2181603 / 1 | 213296 / -72 | 3 / 1 / 4 | 420 / 211 | serving / dispatch | F04 |
| sustained-explore-repro-01 #322 | 22:25:27.982 | ACK OK / 129 | 2186590 / 1 | 109472 / -74 | 3 / 1 / 4 | 421 / 211 | serving / dispatch | F04 |
| sustained-explore-repro-01 #326 | 22:25:33.015 | ACK OK / 155 | 2191604 / 1 | 4736 / -74 | 3 / 1 / 4 | 422 / 212 | serving / dispatch | F04 |
| sustained-explore-repro-01 #330 | 22:25:37.992 | ACK OK / 139 | 2196607 / 1 | 221344 / -75 | 3 / 1 / 4 | 423 / 212 | serving / dispatch | F04 |
| sustained-explore-repro-01 #333 | 22:25:42.993 | ACK OK / 140 | 2201597 / 1 | 122128 / -73 | 3 / 1 / 4 | 423 / 213 | serving / dispatch | F04 |
| sustained-explore-repro-01 #338 | 22:25:48.009 | ACK OK / 156 | 2206599 / 1 | 16272 / -75 | 3 / 1 / 4 | 424 / 213 | serving / dispatch | F04 |
| sustained-explore-repro-01 #342 | 22:25:53.028 | ACK OK / 175 | 2211600 / 1 | 222112 / -75 | 3 / 1 / 4 | 425 / 214 | serving / dispatch | F04 |
| sustained-explore-repro-01 #346 | 22:25:57.994 | ACK OK / 140 | 2216607 / 1 | 122144 / -74 | 3 / 1 / 4 | 426 / 214 | serving / dispatch | F04 |
| sustained-explore-repro-01 #350 | 22:26:03.046 | ACK OK / 193 | 2221599 / 1 | 21440 / -74 | 3 / 1 / 4 | 427 / 215 | serving / dispatch | F04 |
| sustained-explore-repro-01 #354 | 22:26:07.996 | ACK OK / 143 | 2226602 / 1 | 225024 / -75 | 3 / 1 / 4 | 428 / 215 | serving / dispatch | F04 |
| sustained-explore-repro-01 #359 | 22:26:12.987 | ACK OK / 134 | 2231600 / 1 | 123664 / -74 | 3 / 1 / 4 | 429 / 216 | serving / dispatch | F04 |
| sustained-explore-repro-01 #363 | 22:26:18.002 | ACK OK / 149 | 2236600 / 1 | 18816 / -77 | 3 / 1 / 4 | 430 / 216 | serving / dispatch | F04 |
| sustained-explore-repro-01 #367 | 22:26:22.992 | ACK OK / 139 | 2241601 / 1 | 221504 / -74 | 3 / 1 / 4 | 431 / 217 | serving / dispatch | F04 |
| sustained-explore-repro-01 #371 | 22:26:27.992 | ACK OK / 139 | 2246603 / 1 | 114144 / -75 | 3 / 1 / 4 | 432 / 217 | serving / dispatch | F04 |
| sustained-explore-repro-01 #375 | 22:26:33.009 | ACK OK / 156 | 2251604 / 1 | 12208 / -73 | 3 / 1 / 4 | 433 / 218 | serving / dispatch | F04 |
| sustained-explore-repro-01 #380 | 22:26:37.985 | ACK OK / 132 | 2256597 / 1 | 221840 / -74 | 3 / 1 / 4 | 434 / 218 | serving / dispatch | F04 |
| sustained-explore-repro-01 #384 | 22:26:42.990 | ACK OK / 137 | 2261598 / 1 | 117392 / -75 | 3 / 1 / 4 | 435 / 219 | serving / dispatch | F04 |
| sustained-explore-repro-01 #388 | 22:26:48.036 | ACK OK / 182 | 2266631 / 1 | 9408 / -74 | 3 / 1 / 4 | 436 / 219 | serving / dispatch | F04 |
| sustained-explore-repro-01 #392 | 22:26:52.992 | ACK OK / 138 | 2271597 / 1 | 226688 / -75 | 3 / 1 / 4 | 437 / 220 | serving / dispatch | F04 |
| sustained-explore-repro-01 #396 | 22:26:57.992 | ACK OK / 138 | 2276599 / 1 | 122944 / -74 | 3 / 1 / 4 | 438 / 220 | serving / dispatch | F04 |
| sustained-explore-repro-01 #400 | 22:27:03.023 | ACK OK / 170 | 2281612 / 1 | 16368 / -74 | 3 / 1 / 4 | 439 / 221 | serving / dispatch | F04 |
| sustained-explore-repro-01 #405 | 22:27:08.009 | ACK OK / 155 | 2286609 / 1 | 23888 / -75 | 3 / 1 / 4 | 440 / 221 | serving / dispatch | F04 |
| sustained-explore-repro-01 #409 | 22:27:12.985 | ACK OK / 132 | 2291604 / 1 | 205968 / -73 | 3 / 1 / 4 | 441 / 222 | serving / dispatch | F04 |
| sustained-explore-repro-01 #413 | 22:27:17.985 | ACK OK / 132 | 2296602 / 1 | 161824 / -74 | 3 / 1 / 4 | 442 / 222 | serving / dispatch | F04 |
| sustained-explore-repro-01 #417 | 22:27:23.017 | ACK OK / 164 | 2301599 / 1 | 117328 / -74 | 3 / 1 / 4 | 443 / 223 | serving / dispatch | F04 |
| sustained-explore-repro-01 #422 | 22:27:27.978 | ACK OK / 125 | 2306596 / 1 | 73184 / -74 | 3 / 1 / 4 | 444 / 223 | serving / dispatch | F04 |
| sustained-explore-repro-01 #427 | 22:27:33.037 | ACK OK / 183 | 2311611 / 1 | 28608 / -74 | 3 / 1 / 4 | 445 / 224 | serving / dispatch | F04 |
| sustained-explore-repro-01 #431 | 22:27:37.984 | ACK OK / 131 | 2316594 / 1 | 311504 / -74 | 3 / 1 / 4 | 446 / 224 | serving / dispatch | F04 |
| sustained-explore-repro-01 #435 | 22:27:43.016 | ACK OK / 163 | 2321605 / 1 | 267008 / -73 | 3 / 1 / 4 | 447 / 225 | serving / dispatch | F04 |
| sustained-explore-repro-01 #439 | 22:27:47.984 | ACK OK / 131 | 2326593 / 1 | 222944 / -74 | 3 / 1 / 4 | 448 / 225 | serving / dispatch | F04 |
| sustained-explore-repro-01 #443 | 22:27:52.988 | ACK OK / 135 | 2331598 / 1 | 178448 / -73 | 3 / 1 / 4 | 449 / 226 | serving / dispatch | F04 |
| sustained-explore-repro-01 #448 | 22:27:57.988 | ACK OK / 135 | 2336599 / 1 | 134304 / -73 | 3 / 1 / 4 | 450 / 226 | serving / dispatch | F04 |
| sustained-explore-repro-01 #453 | 22:28:06.855 | timeout / 4002 | — | — | — | — | — | — |
| sustained-explore-repro-01 #456 | 22:28:11.859 | timeout / 4005 | — | — | — | — | — | — |
| sustained-explore-repro-01 #459 | 22:28:16.854 | timeout / 4001 | — | — | — | — | — | — |
| sustained-explore-repro-01 #462 | 22:28:21.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #466 | 22:28:26.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #468 | 22:28:27.853 | socket_not_open | — | — | — | — | — | — |
| sustained-explore-repro-01 #470 | 22:28:32.853 | socket_not_open | — | — | — | — | — | — |
| sustained-explore-repro-01 #475 | 22:28:41.854 | timeout / 4001 | — | — | — | — | — | — |
| sustained-explore-repro-01 #478 | 22:28:46.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #481 | 22:28:51.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #484 | 22:28:56.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #488 | 22:29:01.853 | timeout / 4000 | — | — | — | — | — | — |
| sustained-explore-repro-01 #490 | 22:29:02.853 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #5 | 22:29:33.382 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #8 | 22:29:38.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #12 | 22:29:43.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #15 | 22:29:48.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #19 | 22:29:53.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #21 | 22:29:54.383 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #23 | 22:29:59.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #30 | 22:30:08.382 | timeout / 4001 | — | — | — | — | — | — |
| post-drop-recovery-01 #33 | 22:30:13.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #36 | 22:30:18.384 | timeout / 4002 | — | — | — | — | — | — |
| post-drop-recovery-01 #40 | 22:30:23.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #42 | 22:30:24.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #44 | 22:30:29.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #47 | 22:30:34.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #51 | 22:30:43.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #54 | 22:30:48.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #57 | 22:30:53.382 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #61 | 22:30:58.382 | timeout / 4001 | — | — | — | — | — | — |
| post-drop-recovery-01 #63 | 22:30:59.383 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #65 | 22:31:04.382 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #70 | 22:31:13.384 | timeout / 4002 | — | — | — | — | — | — |
| post-drop-recovery-01 #73 | 22:31:18.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #76 | 22:31:23.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #80 | 22:31:28.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #82 | 22:31:29.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #84 | 22:31:34.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #87 | 22:31:39.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #91 | 22:31:48.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #94 | 22:31:53.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #97 | 22:31:58.381 | timeout / 4000 | — | — | — | — | — | — |
| post-drop-recovery-01 #101 | 22:32:03.382 | timeout / 4001 | — | — | — | — | — | — |
| post-drop-recovery-01 #103 | 22:32:04.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #105 | 22:32:09.381 | socket_not_open | — | — | — | — | — | — |
| post-drop-recovery-01 #111 | 22:32:18.384 | timeout / 4001 | — | — | — | — | — | — |
| post-drop-recovery-01 #114 | 22:32:23.388 | timeout / 4007 | — | — | — | — | — | — |
| post-drop-recovery-01 #117 | 22:32:28.381 | timeout / 4000 | — | — | — | — | — | — |
| controlled-usb-restart #5 | 22:38:33.256 | ACK OK / 131 | 283228 / 3 | 289696 / -71 | 5 / 1 / 6 | 26 / 14 | serving / dispatch | F05 |
| controlled-usb-restart #9 | 22:38:38.279 | ACK OK / 155 | 288238 / 3 | 253152 / -72 | 5 / 1 / 6 | 27 / 14 | serving / dispatch | F05 |
| controlled-usb-restart #13 | 22:38:43.295 | ACK OK / 172 | 293239 / 3 | 216224 / -71 | 5 / 1 / 6 | 28 / 15 | serving / dispatch | F05 |
| controlled-usb-restart #17 | 22:38:48.263 | ACK OK / 140 | 298239 / 3 | 179680 / -71 | 5 / 1 / 6 | 29 / 15 | serving / dispatch | F05 |
| controlled-usb-restart #21 | 22:38:53.253 | ACK OK / 130 | 303231 / 3 | 142800 / -70 | 5 / 1 / 6 | 30 / 16 | serving / dispatch | F05 |
| controlled-usb-restart #25 | 22:38:58.348 | ACK OK / 225 | 308242 / 3 | 106256 / -70 | 5 / 1 / 6 | 31 / 16 | serving / dispatch | F05 |
| controlled-usb-restart #29 | 22:39:03.365 | ACK OK / 242 | 313238 / 3 | 69328 / -71 | 5 / 1 / 6 | 32 / 17 | serving / dispatch | F05 |
| controlled-usb-restart #33 | 22:39:08.260 | ACK OK / 137 | 318238 / 3 | 32784 / -71 | 5 / 1 / 6 | 33 / 17 | serving / dispatch | F05 |
| controlled-usb-restart #37 | 22:39:13.288 | ACK OK / 165 | 323253 / 3 | 323184 / -71 | 5 / 1 / 6 | 34 / 18 | serving / dispatch | F05 |

## Retained fault sets

### F01 — bench-idle

| Firmware uptime ms | Stage | I/O | Sanitized error |
| --- | --- | --- | --- |
| 3786050 | serving | first_byte_read | relay closed the stream |
| 7559278 | serving | first_byte_read | relay closed the stream |
| 10947033 | serving | first_byte_read | relay closed the stream |
| 17265374 | serving | first_byte_read | relay closed the stream |

### F02 — floor-explore-poll-and-watch

| Firmware uptime ms | Stage | I/O | Sanitized error |
| --- | --- | --- | --- |
| 17949 | wifi_association | idle | Wi-Fi association did not complete |
| 36451 | wifi_association | idle | Wi-Fi association did not complete |
| 56952 | wifi_association | idle | Wi-Fi association did not complete |

### F03 — floor-active-exploration

| Firmware uptime ms | Stage | I/O | Sanitized error |
| --- | --- | --- | --- |
| 17949 | wifi_association | idle | Wi-Fi association did not complete |
| 36451 | wifi_association | idle | Wi-Fi association did not complete |
| 56952 | wifi_association | idle | Wi-Fi association did not complete |

### F04 — sustained-explore-repro-01

| Firmware uptime ms | Stage | I/O | Sanitized error |
| --- | --- | --- | --- |
| 17949 | wifi_association | idle | Wi-Fi association did not complete |
| 36451 | wifi_association | idle | Wi-Fi association did not complete |
| 56952 | wifi_association | idle | Wi-Fi association did not complete |

### F05 — controlled-usb-restart

| Firmware uptime ms | Stage | I/O | Sanitized error |
| --- | --- | --- | --- |
| 36452 | wifi_association | idle | Wi-Fi association did not complete |
| 56953 | wifi_association | idle | Wi-Fi association did not complete |
| 82921 | wifi_association | idle | Wi-Fi association did not complete |
| 115422 | wifi_association | idle | Wi-Fi association did not complete |
