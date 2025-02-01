from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
import requests
import os
import pymongo
from ytmusicapi import YTMusic

app = FastAPI()

# ==== CONFIG ====
CLIENT_ID = ""
CLIENT_SECRET = ""
REDIRECT_URI = ""  # Change for production
MONGO_URI = "mongodb+srv://devanshtyagi0607:STRNGpass42069@tuneoracle.ytcl7.mongodb.net/?retryWrites=true&w=majority&appName=TuneOracle"  # Change if using cloud MongoDB
DB_NAME = "ytmusic_oauth"
COLLECTION_NAME = "users"

# ==== SETUP MONGO ====
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
users_collection = db[COLLECTION_NAME]

@app.get("/")
def home():
  return {"hi" : "hello"}

# ==== STEP 1: Redirect Users to Google OAuth ====
@app.get("/login")
def login():
    print("login triggered")
    auth_url = (
        "https://accounts.google.com/o/oauth2/auth"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=https://www.googleapis.com/auth/youtube"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(auth_url)

# ==== STEP 2: Handle Google OAuth Callback ====
from ytmusicapi import YTMusic
import json
from fastapi import HTTPException

@app.get("/callback")
def callback(code: str):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="OAuth token exchange failed")

    token_data = response.json()
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="No refresh token received")

    ytmusic = YTMusic.setup(filepath="browser.json", headers_raw=f"Authorization: Bearer {access_token}")

    # Store `browser.json` in MongoDB
    with open("browser.json", "r") as f:
        browser_data = json.load(f)

    users_collection.insert_one({"browser_json": browser_data})

    return {"message": "Login successful! You can now access your YouTube Music data."}

# ==== STEP 3: Refresh Access Token ====
def get_access_token(refresh_token: str):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }

    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to refresh access token")

    return response.json().get("access_token")

# ==== STEP 4: Get YouTube Music API Instance ====
def get_ytmusic_instance():
    user = users_collection.find_one()
    if not user or "browser_json" not in user:
        raise HTTPException(status_code=401, detail="No user authenticated")

    # 🌟 Load `browser.json` from database
    with open("browser.json", "w") as f:
        json.dump(user["browser_json"], f)

    # 🌟 Authenticate `ytmusicapi` using `browser.json`
    ytmusic = YTMusic("browser.json")

    return ytmusic



# ==== STEP 5: Example Endpoint to Fetch YouTube Library ====
@app.get("/library")
def get_library():
    ytmusic = get_ytmusic_instance()
    library = ytmusic.get_library_songs(limit=10)  # Fetches liked songs
    return {"library": library}
