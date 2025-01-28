from models.user import UserSchema
from database import users_collection
import ytmusicapi
from ytmusicapi import YTMusic
import uuid
import json

def create_user(request_headers: str):
  try:
    ytmusicapi.setup(filepath="browser.json", headers_raw=request_headers)
    
    ytmusic = YTMusic("browser.json")
  
    with open("browser.json", "r") as file:
      browser_json = file.read()
    
    new_uid = str(uuid.uuid4())
    
    user_data = {
      "uid" : new_uid,
      "request_headers" : request_headers,
      "browser_json" : browser_json
    }
    
    users_collection.insert_one(user_data)
    return new_uid
  
  except Exception as e:
    print("Create new user error: ", e)
    return e
    
def get_browser_json(uid: str):
  try:
    user_data = users_collection.find_one({ "uid" : uid})
    if user_data:
      browser_json = json.loads(user_data["browser_json"])
      return browser_json
    else:
      return {"Error" : "No such user exists"}
  except Exception as e:
    print(e)

def get_users():
    return list(users_collection.find({}, {"_id": 0}))