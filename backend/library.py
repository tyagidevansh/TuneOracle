import ytmusicapi
from ytmusicapi import YTMusic
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# REALLY putting a lot of trust in the fact that a valid browser.json exists, this is probably a really bad idea

ytmusic = YTMusic("browser.json")

#okay do i really need a whole different file
def get_user_playlists():
  try:
    data =  ytmusic.get_library_playlists()
    return data
  except Exception as e:
    print(e)
    return None
  
def get_history():
  try:
    data = ytmusic.get_history()
    song_titles = [song['title'] for song in data]
    all_titles = ", ".join(song_titles)
    prompt = "i am going to give you a list of songs from a user's youtube music history. look at all of them and tell me what you can get to know from those songs about the user's music taste. respond in one or two paragraphs and talk like you are addressing that user. be playful in your response and surprise the user with how much you know about them but dont actually say that you are going to surprise them. mention the user's favourite genres, moods and mention a few songs here and there. Here are the songs: "
    response = model.generate_content(prompt + all_titles)
    print(response)
    #print(prompt + all_titles)
    
    return response
    
  except Exception as e:
    print(e)
    return None

get_history()