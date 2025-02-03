from models.user import UserSchema
from database import users_collection
import ytmusicapi
from ytmusicapi import YTMusic
import uuid
import json
from services.crypto_service import *

def create_user(request_headers: str):
  try:
    ytmusicapi.setup(filepath="browser.json", headers_raw=request_headers)
    
    ytmusic = YTMusic("browser.json")
  
    with open("browser.json", "r") as file:
      browser_json = file.read()
    
    new_uid = str(uuid.uuid4())
    
    encrypted_uid = encrypt_data(new_uid)
    encrypted_request_headers = encrypt_data(request_headers)
    encrypted_browser_json = encrypt_data(browser_json)
    
    user_data = {
      "uid" : new_uid,
      "request_headers" : encrypted_request_headers,
      "browser_json" : encrypted_browser_json
    }
    
    users_collection.insert_one(user_data)
    return encrypted_uid
  
  except Exception as e:
    print("Create new user error: ", e)
    return e
    
def get_browser_json(uid: str):
  try:
    decrypted_uid = decrypt_data(uid)
    user_data = users_collection.find_one({ "uid" : { decrypted_uid }})
    if user_data:
      decrypted_browser_json = decrypt_data(user_data["browser_json"])
      # browser_json = json.loads(user_data["browser_json"])
      return decrypted_browser_json
    else:
      return {"Error" : "No such user exists"}
  except Exception as e:
    print(e)

def get_users():
    return list(users_collection.find({}, {"_id": 0}))