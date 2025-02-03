from fastapi import APIRouter, Body
from pydantic import BaseModel
from services.ytmusic_service import *
from services.crypto_service import *

ytmusic_router = APIRouter()

class UidModel(BaseModel):
  uid: str 
  
@ytmusic_router.post("/validate-uid")
def validate_uid(data: UidModel):
  decrypted_uid = decrypt_data(data.uid)
  if (is_uid_valid(decrypted_uid)) :
    return {"success" : True, "message" : "This uid corresponds to a valid user"}
  else:
    return {"sucess" : False, "message" : "This uid is not valid"}

@ytmusic_router.post("/profile-details/")
def profile_details(data: UidModel):
  decrypted_uid = decrypt_data(data.uid)
  data = get_profile_details(decrypted_uid)
  if data:
    return data
  else:
    return {"success" : False, "data" : None, "error" :"Something went wrong! Unable to retrieve profile info"}

@ytmusic_router.post("/playlists")
async def get_playlists(data : UidModel):
  decrypted_uid = decrypt_data(data.uid)
  data = get_user_playlists(decrypted_uid)
  if data:
    return {"data": data, "error": None}
  else:
    return {"data": None, "error": "Something went wrong! Unable to retrieve playlists."}

@ytmusic_router.post("/ai-summary")
async def ai_summary(data: UidModel):
  decrypted_uid = decrypt_data(data.uid)
  data = get_ai_summary(decrypted_uid)
  if data:
    return {"data" : data, "error" : None}
  else:
    return {"data" : None, "error" : "Something went wrong! Unable to get AI summary."}