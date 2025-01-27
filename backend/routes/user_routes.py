from fastapi import APIRouter, Body
from pydantic import BaseModel
from services.user_service import *

class RequestHeadersModel(BaseModel):
  request_headers: str 

class UidModel(BaseModel):
  uid: str 

user_router = APIRouter()

@user_router.post("/create_new_user/")
def add_user(data: RequestHeadersModel):
  uid = create_user(data.request_headers)
  return {"uid" : uid}
  
@user_router.post("/get_user_json/")
def get_user_json(data : UidModel):
  return get_browser_json(data.uid)
  
@user_router.get("/users/")
def list_users():
    return get_users()