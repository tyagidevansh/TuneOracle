from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
import requests
import pymongo
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# ==== CONFIG ====
CLIENT_ID = ""
CLIENT_SECRET = ""
REDIRECT_URI = ""  # Update this in production
SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"]

MONGO_URI = "mongodb+srv://devanshtyagi0607:STRNGpass42069@tuneoracle.ytcl7.mongodb.net/?retryWrites=true&w=majority&appName=TuneOracle"  # Change if using cloud MongoDB  # Change this if using a cloud database
DB_NAME = "youtube_oauth"
COLLECTION_NAME = "users"

# ==== SETUP MONGO ====
mongo_client = pymongo.MongoClient(MONGO_URI)
db = mongo_client[DB_NAME]
users_collection = db[COLLECTION_NAME]

app = FastAPI()

# ==== STEP 1: Redirect Users to Google OAuth ====
@app.get("/login")
def login():
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

    # Store refresh token in MongoDB
    user_data = {"refresh_token": refresh_token}
    users_collection.insert_one(user_data)

    return {"message": "Login successful! You can now access your YouTube watch history."}

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

# ==== STEP 4: Fetch YouTube Watch History ====
def get_watch_history():
    user = users_collection.find_one()
    if not user:
        raise HTTPException(status_code=401, detail="No user authenticated")

    refresh_token = user["refresh_token"]
    access_token = get_access_token(refresh_token)

    # Authenticate with Google API
    credentials = Credentials(access_token)
    youtube = build("youtube", "v3", credentials=credentials)

    history_items = []
    next_page_token = None
    count = 0
    playlist_id = "HL"  # YouTube's default Watch History playlist

    while count < 10:
        request = youtube.playlistItems().list(
            part="snippet",
            playlistId=playlist_id,
            maxResults=10,  # Max per request
            pageToken=next_page_token,
        )
        response = request.execute()
        print(response)

        for item in response.get("items", []):
            print(item)
            snippet = item.get("snippet", {})
            video_id = snippet.get("resourceId", {}).get("videoId")
            title = snippet.get("title", "Unknown Title")

            if video_id:
                history_items.append({"video_id": video_id, "title": title})
                count += 1
                if count >= 10:
                    break

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return history_items

# ==== STEP 5: API Endpoint to Get Watch History ====
@app.get("/history")
def fetch_history():
    history = get_watch_history()
    return {"watch_history": history}
