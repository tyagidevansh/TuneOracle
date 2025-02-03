from ytmusicapi import YTMusic
import ytmusicapi
from typing import Optional
from database import users_collection
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