from ytmusicapi import YTMusic
import ytmusicapi
from typing import Optional
from database import users_collection
import json

def setup(uid : str) -> Optional[YTMusic]:
  try:
    user = users_collection.find_one({"uid" : uid})
    
    if not user or not "browser_json" in user:
      return {"error" : "User not found or missing browser_json."}
    
    # browser_json = json.loads(user["browser_json"])
    browser_json = user["browser_json"]
    
    ytmusic = YTMusic(browser_json)
    return ytmusic
  except Exception as e:
    return None


def get_user_playlists(uid : str):
  try:
    ytmusic = setup(uid)
    if not ytmusic:
      return {"error": "Failed to setup YTMusic instance."}
    data = ytmusic.get_library_playlists()
    return data
  except Exception as e:
    print(e)
    return None