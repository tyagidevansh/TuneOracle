#uvicorn main:app --reload

from typing import Union
import subprocess
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from login import get_user_data
import library
from pymongo import MongoClient
import gridfs
import os

# root route first makes a get request and python calls the getuserinfo api to check if the browser.json file exists or 
# if its correct. if its not only then display that enter cookies thingy

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
async def get_request_headers(requestHeaders : str):
  pass

# as a unique browser.json is required for each user i will have to save the cookies in browser local storage (or a unique identifier)
# this identifier should be sent to the backend to check if the user has logged in previously. 
# will have to set up a database which stores different browser.json(s) and then when im instantiating ytmusic objects
# my ytmusic objects would probably also need to be stored in those databases and accessed via the user's identifier on each request 
@app.get("/")
async def check_login():
  data = await get_user_data()
  if (data):
    return data
  else:
    return 

@app.post("/store_headers")
async def store_headers():
  pass

@app.get("/playlists")
async def get_playlists():
  data = library.get_user_playlists()
  if data:
    return {"data": data, "error": None} # much better format gotta use this in every api call including the one above
  else:
    return {"data": None, "error": "Something went wrong! Unable to retrieve playlists."}

@app.get("/recents")
async def get_recent_taste():
  data = library.get_history()
  if data:
    return {"data": data, "error": None}
  else:
    return {"data": None, "error": "Something went wrong! Unable to retrieve ai summary."}