from fastapi import APIRouter, Body
from pydantic import BaseModel
from services.ytmusic_service import *

ytmusic_router = APIRouter()

class UidModel(BaseModel):
  uid: str 

@ytmusic_router.get("/playlists")
async def get_playlists(data : UidModel):
  data = get_user_playlists(data.uid)
  if data:
    return {"data": data, "error": None} # much better format gotta use this in every api call including the one above
  else:
    return {"data": None, "error": "Something went wrong! Unable to retrieve playlists."}