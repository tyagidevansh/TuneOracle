import ytmusicapi
ytmusicapi.setup(filepath="browser.json", headers_raw='''POST /youtubei/v1/browse?prettyPrint=false HTTP/2
Host: music.youtube.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br, zstd
Content-Type: application/json
Content-Length: 3468
Referer: https://music.youtube.com/
X-Goog-Visitor-Id: CgszdVI5QmFHUVdxNCiFp8-8BjIKCgJJThIEGgAgbA%3D%3D
X-Youtube-Bootstrap-Logged-In: true
X-Youtube-Client-Name: 67
X-Youtube-Client-Version: 1.20250122.01.00
X-Goog-AuthUser: 0
X-Origin: https://music.youtube.com
Origin: https://music.youtube.com
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: same-origin
Sec-Fetch-Site: same-origin
Authorization: SAPISIDHASH 1737741199_4098dbd35023bad711f7b829fe518cf98c02093a_u SAPISID1PHASH 1737741199_4098dbd35023bad711f7b829fe518cf98c02093a_u SAPISID3PHASH 1737741199_4098dbd35023bad711f7b829fe518cf98c02093a_u
Connection: keep-alive
Alt-Used: music.youtube.com
Cookie: VISITOR_INFO1_LIVE=3uR9BaGQWq4; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgbA%3D%3D; PREF=tz=Asia.Kolkata&f4=4000000&f7=150&repeat=NONE&autoplay=true&f6=40000000&volume=16; __Secure-1PSIDTS=sidts-CjIBmiPuTV9UQ3KWxq6kEn6Savj0DxaRRRF5l3kqXycqsRhvdCbqgk41CN-e5g4RBC44HBAA; __Secure-3PSIDTS=sidts-CjIBmiPuTV9UQ3KWxq6kEn6Savj0DxaRRRF5l3kqXycqsRhvdCbqgk41CN-e5g4RBC44HBAA; SID=g.a000sggLA2I6WrDVaLTCKXJkELxm1QSE8CzpAp5jpKj3MtoJQYeqeTUcUCpO45ceRZKULYwiEQACgYKAVQSARASFQHGX2MiGR57uYif4SvW-OGYEoTskhoVAUF8yKo7YvoGNBbsrYDASbrl0Fx80076; __Secure-1PSID=g.a000sggLA2I6WrDVaLTCKXJkELxm1QSE8CzpAp5jpKj3MtoJQYeqvTFZz64Yo5o3Sv4l1_wcfgACgYKAbISARASFQHGX2MiC2K8E7NAv9DI11_SWCMzOxoVAUF8yKqwVCMpLGy3TO9gHNXJt6yi0076; __Secure-3PSID=g.a000sggLA2I6WrDVaLTCKXJkELxm1QSE8CzpAp5jpKj3MtoJQYeqyE4G_zAOJMsVIt0u8Ntk7QACgYKAckSARASFQHGX2MisnvJQrfJo1inpjOnmHP5tBoVAUF8yKowUCF6YHhUTvmPoyXwXfpS0076; HSID=Ausv_T-yN_mMXOo29; SSID=AnPGbfHr7wAoDwCiW; APISID=q8JXGxK0haU3lNJu/ASm2kYPm3VihJDFj2; SAPISID=gICautfjyQlvbh_Q/A_xCGX_kGMtIxw6Vi; __Secure-1PAPISID=gICautfjyQlvbh_Q/A_xCGX_kGMtIxw6Vi; __Secure-3PAPISID=gICautfjyQlvbh_Q/A_xCGX_kGMtIxw6Vi; LOGIN_INFO=AFmmF2swRQIhAPu27CaEg2-iI2GJ3s6GHrRBdgNgh5ZHQ8mOh29t_1m5AiADN5Ob0ZMUB5e9gjfrRoH7ulMs6ETLoDLMh3oKyGKJng:QUQ3MjNmeGlyOEpMd1lqeXRiczdObU5fZnhaZjdpSFR0STN0a1BpblRKS2ltc0JNRDNZWFNHbHlDbzhLcFJRbmIzUGVfcFZGMmVYenlta3lEQnQ3VEtvOUZSTERJWVoySHN5QzVvVWo5M1ZneldYcUdNRWJTWm5MUVdJZ1hvSXZIbG1DVVkyYmgyRTJxNWtBR25LVlZtaDJhUFEyNDVrTTJB; SIDCC=AKEyXzX3WcTPMUc1VwpA2Euzn_E8XS3WAdQk3_HmaMHCavBnwqADK0HBjULpkaQT83XxzYoaFuo; __Secure-1PSIDCC=AKEyXzV550gVVSyboeUDSJT5H2JLCsR0RiHnBa_9BYEogj_ARCZdcjFPpi4__qLBtp9LakNmWtOC; __Secure-3PSIDCC=AKEyXzXidrdAEtPdilrbOHmHhRVZN7euRQLQ64SyLAPMp3OiXxXLwKXeyoP0IiElL7HBjzbePzc; __Secure-ROLLOUT_TOKEN=CLff_7v6q8aoRRDrxO72ha6KAxjegrGa146LAw%3D%3D; YSC=CpRx-2NCjhs; wide=0; CONSISTENCY=AKreu9ta0fFJ2Sfcpl8IXBW4CVG30r9WivxGoxN_ZLzQ6Yz2zrnVgpuZWtClE4PU-skkFen_cwc1waLi1C-3KfMJViVBj6lT3EcCjAxjNIP9cncju5blCMasdy7aIHvimh-6suOirTp4I8JyIrjsCRnV; ST-1qktme9=csn=-OFbT5-RBD4sS5IY&itct=CNgCEKCzAhgBIhMI1Y_fsvaOiwMVvJvYBR2oWxkY
Priority: u=0
TE: trailers''')
