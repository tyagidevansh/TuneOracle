import { useEffect, useState } from "react";

interface UserData {
  accountName: string,
  channelHandle: string,
  accountPhotoUrl: string,
}

interface Playlist {
  title: string;
  playlistId: string;
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  description: string;
  count?: string;
  author?: Array<{
    name: string;
    id: string;
  }>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export default function LandingPage ({ userData }: { userData: UserData }) {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasteSumarry, setTasteSummary] = useState<string | null>(null)

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('http://localhost:8000/playlists', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
        },
      });

      const json: ApiResponse<Playlist[]> = await response.json();

      if (json.error){
        setError(json.error);
      } else {
        setPlaylists(json.data);
        console.log(json.data);
      }
    } catch (error) {
      console.log("Playlist error ", error);
    }
  }

  const fetchTasteSummary = async () => {
    try {
      const response = await fetch('http://localhost:8000/recents', {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
        },
      });
      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setTasteSummary(json.data);
      }

    } catch (error) {
      console.log("recents error : ", error);
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, []);

  return (
    <div className="text-white">
      <div className="text-3xl text-center mt-16">
        Hello {userData.accountName}!
      </div>
      <div className="text-xl">
        {tasteSumarry}
      </div>
      
    </div>
  )
};