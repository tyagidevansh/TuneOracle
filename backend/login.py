from ytmusicapi import YTMusic
import ytmusicapi
from typing import Optional

def setup() -> Optional[YTMusic]:
  try:
    ytmusic = YTMusic("browser.json")
    return ytmusic
  except Exception as e:
    return None
  
async def get_user_data():
  try:
    ytmusic = setup()
    if (ytmusic):
      data = ytmusic.get_account_info()
      return data
    else:
      return None
    
  except Exception as e:
    print(f"error: {e}")
