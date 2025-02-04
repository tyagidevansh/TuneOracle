from ytmusicapi import YTMusic
from typing import Optional
from database import users_collection, playlists_collection
import json
import google.generativeai as genai
import os
import tempfile
from services.crypto_service import *

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def setup_with_memory_file(uid: str) -> Optional[YTMusic]:
  try:
    user = users_collection.find_one({"uid": uid})
    
    if not user or "browser_json" not in user:
      return {"error": "User not found or missing browser_json."}
        
    with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
      decrypted_browser_json = decrypt_data(user["browser_json"])
      temp_file.write(decrypted_browser_json)
      temp_file_path = temp_file.name
    
    ytmusic = YTMusic(temp_file_path)
    
    os.remove(temp_file_path)
    
    return ytmusic
  except Exception as e:
      print(f"Error: {e}")
      return None
      
def setup(uid : str) -> Optional[YTMusic]:
  print("Setup called ")
  try:
    user = users_collection.find_one({"uid" : uid})
      
    if not user or not "browser_json" in user:
      return {"error" : "User not found or missing browser_json."}
    
    # browser_json = json.loads(user["browser_json"])
    browser_json = user["browser_json"]
    file_path = f"browser_{uid}.json"
    
    with open(file_path, "w") as f:
      f.write(browser_json)
    
    ytmusic = YTMusic(file_path)
    return ytmusic
  except Exception as e:
    print("Setup exception : ", e)
    return None

def is_uid_valid(uid : str) -> bool:
  try: 
    ytmusic = setup_with_memory_file(uid)
    if not ytmusic: 
      print("ytmusic instance not created when validating uid")
      return False
  
    data = ytmusic.get_home(limit = 1)
    if data and isinstance(data, list) and len(data) > 0:
      return True
    else:
      print("ytmusic instance created but authenticaion failed")
      return False
    
  except Exception as e:
    print(f"Error validating UID: {e}")
    return False

def get_profile_details(uid: str):
  try:
    ytmusic = setup_with_memory_file(uid)
    if not ytmusic:
      return {"success" : False, "error" : "Failed to setup YTMusic instance."}
    data = ytmusic.get_account_info()
    return data
  
  except Exception as e:
    return {"success" : False, "error" : e}
    
def get_user_playlists(uid : str):
  try:
    ytmusic = setup_with_memory_file(uid)
    if not ytmusic:
      return {"success" : False, "error": "Failed to setup YTMusic instance."}
    data = ytmusic.get_library_playlists()
    return data
  except Exception as e:
    print(e)
    return {"error" : "Expired headers!"}
  
def get_ai_summary(uid : str):
  try:
    ytmusic = setup_with_memory_file(uid)
    data = ytmusic.get_history()
    song_titles = [song['title'] for song in data]
    all_titles = ", ".join(song_titles)
    prompt = "i am going to give you a list of songs from a user's youtube music history. look at all of them and tell me what you can get to know from those songs about the user's music taste. respond in one or two paragraphs and talk like you are addressing that user. be playful in your response and surprise the user with how much you know about them but dont actually say that you are going to surprise them. don't begin with 'hey there music lover!' everytime. switch it up. talk like you are an AI who knows a lot, but keep in mind you are talking to a real person. mention the user's favourite genres, moods and mention a few songs here and there. Here are the songs: "
    response = model.generate_content(prompt + all_titles)
    return response.text
    
  except Exception as e:
    print("get_history exception: ", e)
    return None

def generate_ai_playlist_data(playlist_id: str, data: str):
  print("function called")
  prompt = "I am going to give you a list of song titles. It could be a long list. Your job is to look at all of those songs and judge them based on three metrics : how happy or sad those songs are, how energetic they are, and how obscure they are. i define obscurity as the opposite of popularity - basically how likely is it that most people would not have heard that song. a higher obscurity score = the songs i give you are full of songs by very small or indie artists, and not a lot of big name artists. do not assume the user is from an english speaking country, songs in other languages can still be very popular and not obscure at all, for example bollywood music and anime title tracks. In your output, you MUST only give 3 numbers, each from 1 to 100 rating the playlist on the specified parameters, separated by nothng but a single space. I reiterate, judge the songs based on happiness, energy and obscurity (list scores in that order in the response) and return ONLY three numbers, nothing else. Here are the songs:"
  LLMresponse = model.generate_content(prompt + data)
  arr = LLMresponse.text.split()
  response = {
    "playlist_id" : playlist_id,
    "happy" : arr[0],
    "energy": arr[1],
    "obscure": arr[2],
  }
  return response

def get_playlist_content(uid : str, playlist_id: str):
  try:
    ytmusic = setup_with_memory_file(uid)
    data = ytmusic.get_playlist(playlist_id, None, True, 0)
    trackList = data["tracks"]    
    trackTitles = []

    for track in trackList:
      trackTitles.append(track["title"])
    
    response = {}
    
    response["trackCount"] = data["trackCount"]
    response["tracks"] = trackTitles
    response["thumbnail"] = data["thumbnails"][2]["url"]
    
    relatedPlaylists = data["related"]
    related = []

    for playlist in relatedPlaylists:
      description = playlist.get("description", "")  

      if "Playlist • YouTube Music" not in description:
        related.append(playlist)

      if len(related) > 3:
        break

      response["related"] = related
    
    playlist_info = playlists_collection.find_one({"playlist_id" : playlist_id})
    print(playlist_info)
    if not playlist_info:
      if len(trackTitles) > 500:
        trackTitles = trackTitles[:500]
      trackTitlesString = ", ".join(trackTitles)
      playlist_info = generate_ai_playlist_data(playlist_id, trackTitlesString)
      playlists_collection.insert_one(playlist_info)
    
    if "_id" in playlist_info:
        del playlist_info["_id"]
    response["playlist_info"] = playlist_info

    return response
  except Exception as e:
    print(e) 
    return None
  