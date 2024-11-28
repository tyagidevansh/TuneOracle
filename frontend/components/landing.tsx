import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface UserData {
  accountName: string;
  channelHandle: string;
  accountPhotoUrl: string;
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

export default function LandingPage({ userData }: { userData: UserData }) {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tasteSummary, setTasteSummary] = useState<string | null>("loading");

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:8000/playlists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json: ApiResponse<Playlist[]> = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setPlaylists(json.data);
      }
    } catch (error) {
      console.log("Playlist error ", error);
    }
  };

  const fetchTasteSummary = async () => {
    try {
      const response = await fetch("http://localhost:8000/recents", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
  };

  useEffect(() => {
    fetchPlaylists();
    //fetchTasteSummary();
  }, []);

  return (
    <div className="bg-gradient-to-b from-purple-900 via-black to-gray-900 min-h-screen text-white font-sans">
      {/* Header */}
      <div className="text-center p-8">
        <motion.h1
          className="text-5xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome, {userData.accountName}!
        </motion.h1>
        <motion.img
          src={userData.accountPhotoUrl}
          alt="User profile"
          className="w-24 h-24 rounded-full mx-auto mt-4 border-4 border-gray-700"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </div>

      <motion.div
        className="text-center mx-auto max-w-3xl p-6 bg-gray-900 bg-opacity-80 rounded-xl shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold mb-4">
          Here's what AI thinks of your music taste:
        </h2>
        {tasteSummary === "loading" ? (
          <div className="flex justify-center">
            <motion.div
              className="w-12 h-12 border-4 border-t-pink-400 border-pink-700 rounded-full animate-spin"
              aria-label="Loading spinner"
            />
          </div>
        ) : (
          <motion.p
            className="text-xl mt-4 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {tasteSummary}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-4xl font-semibold mb-6">Your Playlists</h2>
        {playlists ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.playlistId}
                className="bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 text-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition duration-300"
              >
                <img
                  src={playlist.thumbnails[0]?.url}
                  alt={playlist.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-2xl font-bold truncate">{playlist.title}</h3>
                  <p className="text-gray-300 mt-2 line-clamp-2">
                    {playlist.description || "No description available"}
                  </p>
                  {playlist.count && (
                    <p className="mt-2 text-sm text-gray-400">
                      {playlist.count} songs
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-lg text-gray-400 mt-6">Loading playlists...</div>
        )}
      </motion.div>
    </div>
  );
}
