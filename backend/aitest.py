import ytmusicapi
from ytmusicapi import YTMusic
import os
from dotenv import load_dotenv

load_dotenv()

try:
  ytmusic = YTMusic('oauth.json', oauth_credentials=OAuthCredentials(client_id=os.getenv(OAUTH_CLIENT_ID), client_secret=os.getenv(OAUTH_CLIENT_SECRET)))
except Exception as e:
  print(e)