from ytmusicapi import YTMusic
import json

# generate using 'ytmusicapi browser'
AUTH_FILE = "browser.json"

def authenticateYTMusic():
  try:
      ytmusic = YTMusic(AUTH_FILE)
      return ytmusic
  except Exception as e:
      print(f"Error initializing YTMusic API: {e}. Please make sure you are logged in to your YouTube Music account and try again.")
      exit()

def getTrackListFromPlaylist(ytmusic: YTMusic, playlistId: str) -> None:
  try:
    data = ytmusic.get_playlist(playlistId, 100, False, 0) #limit, show related, suggestions limit
    tracks = data['tracks']
    for track in tracks:
      print(track['title'])
    
  except Exception as e:
    print(f"Error retrieving songs from this playlist {e}")

def main():
  try:
    ytmusic = authenticateYTMusic()
    getTrackListFromPlaylist(ytmusic, "PLmo7ldvycx2Jt-cvf7fbS-zFhUyYgZ1jy")
    
  except KeyboardInterrupt:
    print("")
    print("Exiting...")
    exit()
    
if __name__ == "__main__":
  main()