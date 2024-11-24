import ytmusicapi
from ytmusicapi import YTMusic

ytmusicapi.setup(filepath="browser.json", headers_raw='''POST /youtubei/v1/browse?prettyPrint=false HTTP/2
  Host: music.youtube.com
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0
  Accept: */*
  Accept-Language: en-US,en;q=0.5
  Accept-Encoding: gzip, deflate, br, zstd
  Content-Type: application/json
  Content-Length: 3321
  Referer: https://music.youtube.com/
  X-Goog-Visitor-Id: CgszdVI5QmFHUVdxNCi_1o26BjIKCgJJThIEGgAgbA%3D%3D
  X-Youtube-Bootstrap-Logged-In: true
  X-Youtube-Client-Name: 67
  X-Youtube-Client-Version: 1.20241118.01.00
  X-Goog-AuthUser: 0
  X-Origin: https://music.youtube.com
  Origin: https://music.youtube.com
  Sec-Fetch-Dest: empty
  Sec-Fetch-Mode: same-origin
  Sec-Fetch-Site: same-origin
  Authorization: SAPISIDHASH 1732471626_da74cb133b218f1d0cbcb18b8977c5022b312602_u
  Connection: keep-alive
  Cookie: VISITOR_INFO1_LIVE=3uR9BaGQWq4; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgbA%3D%3D; PREF=tz=Asia.Kolkata&f4=4000000&f7=150&repeat=NONE&autoplay=true&f6=40000000; __Secure-1PSIDTS=sidts-CjIBQT4rX6S6SFj_NXJhVxjWQY1PWEle0sLRchz1Is89BcXRiuWpGFcyMRNipHHGEVVvERAA; __Secure-3PSIDTS=sidts-CjIBQT4rX6S6SFj_NXJhVxjWQY1PWEle0sLRchz1Is89BcXRiuWpGFcyMRNipHHGEVVvERAA; SID=g.a000qQgLA1qTd-rNpl-IsVKE5XftevJOFPEVehIfJ91STRYi7d6fLNJfP4A2Ozvda9sRAs9c5QACgYKAfkSARASFQHGX2MiMsdOFSrAB7XqUsrs2XAX0RoVAUF8yKpRGyE6qcbCR6GD6rLDsor90076; __Secure-1PSID=g.a000qQgLA1qTd-rNpl-IsVKE5XftevJOFPEVehIfJ91STRYi7d6fHsovzaozYbS4aql9WRytdAACgYKAaQSARASFQHGX2MiGFlR3ly8nVjB-Fp3PpPxGxoVAUF8yKpySCuYtxxFGMw9r7lN8NzL0076; __Secure-3PSID=g.a000qQgLA1qTd-rNpl-IsVKE5XftevJOFPEVehIfJ91STRYi7d6fZI6zllF12P95AWYcvOhrOAACgYKAZQSARASFQHGX2MiQCj4C_iiFgdzY2sVoG8l_hoVAUF8yKppC9AgTR1FWCrCNOODf2-n0076; HSID=A40X9MoqD9y3-wDlh; SSID=AuIhEvy4sehm8YpRf; APISID=BUJbqjKIOmlsiFqe/ADD3BVY0JAAxuETc-; SAPISID=NHpa9TG7wu-6nFDb/AcmxB_u4-HisR9n9Z; __Secure-1PAPISID=NHpa9TG7wu-6nFDb/AcmxB_u4-HisR9n9Z; __Secure-3PAPISID=NHpa9TG7wu-6nFDb/AcmxB_u4-HisR9n9Z; LOGIN_INFO=AFmmF2swRQIhAPu27CaEg2-iI2GJ3s6GHrRBdgNgh5ZHQ8mOh29t_1m5AiADN5Ob0ZMUB5e9gjfrRoH7ulMs6ETLoDLMh3oKyGKJng:QUQ3MjNmeGlyOEpMd1lqeXRiczdObU5fZnhaZjdpSFR0STN0a1BpblRKS2ltc0JNRDNZWFNHbHlDbzhLcFJRbmIzUGVfcFZGMmVYenlta3lEQnQ3VEtvOUZSTERJWVoySHN5QzVvVWo5M1ZneldYcUdNRWJTWm5MUVdJZ1hvSXZIbG1DVVkyYmgyRTJxNWtBR25LVlZtaDJhUFEyNDVrTTJB; SIDCC=AKEyXzW8QEkLnXfrZIvb_vShWbLZTlQ4qtaxhVlAdyYhA6pHeBuuuRbxzQ2abNApDo2hei-pK6g; __Secure-1PSIDCC=AKEyXzU8TwJ9uqyIMdTnB72Y00zsLPvCTIu0IWYTmyNDB_LRTB0SmLp2Sf-5VALyx0zZqXKhQZdb; __Secure-3PSIDCC=AKEyXzVnWuk2sftd9SvkmtfChSsvYHOKxDjuGun0UXLY93k_RG31DkJMCFsXAqTbJZlheRkjRQY; YSC=CpRx-2NCjhs; wide=0; ST-sbra4i=session_logininfo=AFmmF2swRQIgUJtZIdOrAkw89M8GUJ1pCRbqxVQtDf5oBEq_tZYwZywCIQDM_FW9749FrPFAj1Z24eX3SEzzSJqK-SSDczCUmiv6pQ%3AQUQ3MjNmekpaNV9yM01GNE5GOUNCSElaQUxnZTVRNi1SeWIwZUJCLTdHZTVrOGZNWkFQeGJ1VnRFenEyZTVlbDk5NE5ILTNhNTA5QzJMTG1DRVVraEJhMm9ZX3hvRGxSeDZfWnNtbHZpTHhQMkVYd3N2MkRaVlZ0R3R4bDltZm9RLUwyTVNZLVZJX1NBWS1pOEpzNkYzY1pZSy1CRHg5V2NR; ST-15pe5qh=csn=l4qVzPATN5U0XRRr&itct=CIMDEKCzAhgCIhMImruG0sH1iQMVsI_YBR3o_jEJ
  Priority: u=0
  TE: trailers''')

ytmusic = YTMusic("browser.json")

try:
  data = ytmusic.get_account_info()
  print(data)
except Exception as e:
  print(f"error: {e}")