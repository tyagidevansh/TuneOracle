from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from services.user_service import *

class RequestHeadersModel(BaseModel):
  request_headers: str 

class UidModel(BaseModel):
  uid: str 

user_router = APIRouter()

@user_router.post("/create-new-user/")
def add_user(data: RequestHeadersModel):
    try:
        uid = create_user(data.request_headers)
        
        if isinstance(uid, Exception):
            raise HTTPException(status_code=400, detail=str(uid))

        return JSONResponse(
            status_code=201,
            content={"success": True, "message": "User created successfully", "uid": uid}
        )

    except HTTPException as e:
        return JSONResponse(status_code=e.status_code, content={"success": False, "message": e.detail})

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal Server Error", "error": str(e)}
        )

@user_router.get("/users/")
def list_users():
    return get_users()

@user_router.get("/")
def get_home():
    return {"success" : True, "message" : "Welcome to the TuneOracle API!"}