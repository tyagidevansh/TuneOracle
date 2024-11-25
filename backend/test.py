import ytmusicapi
from ytmusicapi import YTMusic

ytmusicapi.setup(filepath="browser.json", headers_raw='''accept:
*/*
accept-encoding:
gzip, deflate, br, zstd
accept-language:
en-US,en;q=0.9
authorization:
SAPISIDHASH 1732478400_a4a0bc12d37f8b9fc2fec9f3d405cef0ef7f5a1c_u
content-length:
3489
content-type:
application/json
cookie:
wide=0; __Secure-3PAPISID=LzT8uTIbDUPisAIa/A-gPnE7cmALvsWe7K; VISITOR_INFO1_LIVE=ly_swr4MG5M; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgYw%3D%3D; _gcl_au=1.1.747594417.1731913746; YSC=NrtdEK0uVQI; __Secure-1PSIDTS=sidts-CjIBQT4rX0fJ0BcPxB7Deap0oOkRpk8efVJV6ZMKvWsENQ4vG_9FuC9MXgYVPEZiu6-SGRAA; __Secure-3PSIDTS=sidts-CjIBQT4rX0fJ0BcPxB7Deap0oOkRpk8efVJV6ZMKvWsENQ4vG_9FuC9MXgYVPEZiu6-SGRAA; HSID=A0djVgiz0QDaeD2j1; SSID=AQIkZwpk7Ml24CSEA; APISID=r5zzNJ3lXBm0eCaE/ATn9cN9RbV_k-xHf1; SAPISID=LzT8uTIbDUPisAIa/A-gPnE7cmALvsWe7K; __Secure-1PAPISID=LzT8uTIbDUPisAIa/A-gPnE7cmALvsWe7K; SID=g.a000qAgLA3e2Kkspug0LggCLF_7BeFPWzzgLOx5vwz6NDEJ1qE31hOGN0ZWsSm1qrZjSK1ABJwACgYKATUSARASFQHGX2MiRLpiU6psAPbdl20xwR1guRoVAUF8yKprYmmc4b49suz_jST7qh0T0076; __Secure-1PSID=g.a000qAgLA3e2Kkspug0LggCLF_7BeFPWzzgLOx5vwz6NDEJ1qE31Bbgm33J6Gb39jfS6MnBhSQACgYKAbESARASFQHGX2MibQzHyjhthb0-gEAtnkSonBoVAUF8yKodfG2XQEx5eGSNrRXjg66H0076; __Secure-3PSID=g.a000qAgLA3e2Kkspug0LggCLF_7BeFPWzzgLOx5vwz6NDEJ1qE31vODJtspqFRhpqzpUuP0JqwACgYKAbcSARASFQHGX2MiIflg1fJ3wFu-iXXxGOjIEhoVAUF8yKoXwBQiD35wYNLlykHIR0Nd0076; LOGIN_INFO=AFmmF2swRQIgLmz6QHCQIvSN-pdNtL-_NGHkxMD8HJCKcLxGR2nH9pACIQDvgbrP68nZWTjdU8YY70ql_L36gxZuYUNK8ggVIUAOfw:QUQ3MjNmeU4tVVlNN0pVRFJJQ18xRTZLd1k0dEpSb2kwNnh2VWp1VXlrVlJaQ3daRVhlVUhuM1g4T1RhN2dJRG45R2Qyb1VscFdKNlktT3V2VWctMkJkSHBod1R4YjFkTlFMcWpzY2lNR2duQmdHNldnZm5EbXY1YXJjbko3YkJVMFItRUd0VXRaSTVtanJsY2gta3FRTWZHU3M5R2UzMHdB; SIDCC=AKEyXzW5-Rkqff8YVmYVDPgqkan1A8BAxgKRoh9YF-V7xq9I7aJbFMbBxpp92vcgdHJdQ-xF0Q; __Secure-1PSIDCC=AKEyXzXdBjn5JgK4vSJNp_R4bsPQ380Vuo4xrIvCbgGJAbtgaisZK3KfqUYHAohPFBWUy8eWkho; __Secure-3PSIDCC=AKEyXzWGrd92aeMUZrqVEMv4vxHy2Nl0cDwxmkJUZKf5TQ3ZpBwdQG02AJ4JvsE9a5FEwlze8-88; ST-1k9hzuz=csn=ZzurjS-Cn3nrL3ft&itct=CIoEEKCzAhgAIhMI1oO5-eD1iQMVKC23AB1ENg80
origin:
https://music.youtube.com
priority:
u=1, i
referer:
https://music.youtube.com/
sec-ch-ua:
"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"
sec-ch-ua-arch:
"x86"
sec-ch-ua-bitness:
"64"
sec-ch-ua-form-factors:
"Desktop"
sec-ch-ua-full-version:
"131.0.6778.86"
sec-ch-ua-full-version-list:
"Google Chrome";v="131.0.6778.86", "Chromium";v="131.0.6778.86", "Not_A Brand";v="24.0.0.0"
sec-ch-ua-mobile:
?0
sec-ch-ua-model:
""
sec-ch-ua-platform:
"Windows"
sec-ch-ua-platform-version:
"15.0.0"
sec-ch-ua-wow64:
?0
sec-fetch-dest:
empty
sec-fetch-mode:
same-origin
sec-fetch-site:
same-origin
user-agent:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
x-client-data:
CJW2yQEIo7bJAQiJksoBCKmdygEI5e/KAQiSocsBCJv+zAEIhaDNAQiBic4BCLGezgEI+8nOAQjDzM4BCNLNzgEIx8/OAQjUz84BCPXPzgEIgNDOAQiu0M4BGPXJzQEYnLHOARiAys4BGJPQzgE=
Decoded:
message ClientVariations {
  // Active Google-visible variation IDs on this client. These are reported for analysis, but do not directly affect any server-side behavior.
  repeated int32 variation_id = [3300117, 3300131, 3311881, 3313321, 3323877, 3330194, 3358491, 3362821, 3376257, 3378993, 3384571, 3384899, 3385042, 3385287, 3385300, 3385333, 3385344, 3385390];
  // Active Google-visible variation IDs on this client that trigger server-side behavior. These are reported for analysis *and* directly affect server-side behavior.
  repeated int32 trigger_variation_id = [3368181, 3381404, 3384576, 3385363];
}
x-goog-authuser:
0
x-goog-visitor-id:
CgtseV9zd3I0TUc1TSi4i466BjIKCgJJThIEGgAgYw%3D%3D
x-origin:
https://music.youtube.com
x-youtube-bootstrap-logged-in:
true
x-youtube-client-name:
67
x-youtube-client-version:
1.20241118.01.00''')

ytmusic = YTMusic("browser.json")

try:
  data = ytmusic.get_account_info()
  print(data)
except Exception as e:
  print(f"error: {e}")