from typing import Union
import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from login import get_user_data

# root route first makes a get request and python calls the getuserinfo api to check if the browser.json file exists or 
# if its correct. if its not only then display that enter cookies thingy

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def check_login():
  data = await get_user_data()
  if (data):
    return data
  else:
    return 
    
@app.post("/login")
async def get_request_headers(requestHeaders : str):
  pass