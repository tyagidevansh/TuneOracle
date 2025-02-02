"use client";

import { useEffect, useState } from "react";
import { post } from "../services/pyApi";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Music2, PlayCircle } from "lucide-react";

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

export default function Landing({ uid }: { uid: string }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const fetchMainData = async () => {
      try {
        const [userDetails, playlistData] = await Promise.all([
          post("/profile-details", { uid }),
          post("/playlists", { uid })
        ]);
        setUserData(userDetails);
        setPlaylists(playlistData?.data || []);
      } catch (error) {
        console.error("Error fetching main data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAiSummary = async () => {
      try {
        const summaryData = await post("/ai-summary", { uid });
        setAiSummary(summaryData?.data || "No summary available.");
      } catch (error) {
        console.error("Error fetching AI summary:", error);
      } finally {
        setAiLoading(false);
      }
    };

    fetchMainData();
    fetchAiSummary();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex justify-center w-full items-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-purple-300 animate-pulse">Loading your musical universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-black to-indigo-900 text-white px-6 py-12">
      {userData && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-8 mb-16 bg-black/30 p-8 rounded-2xl backdrop-blur-sm">
            <div className="relative">
              <Image
                src={userData.accountPhotoUrl}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full border-4 border-purple-500 shadow-lg shadow-purple-500/50"
              />
              <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2">
                <Music2 className="h-5 w-5" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome, {userData.accountName}!
              </h1>
              <p className="text-purple-300">@{userData.channelHandle}</p>
            </div>
          </div>

          <Card className="bg-black/40 border-purple-500/20 p-6 mb-12 backdrop-blur-md">
            <CardContent>
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Your Musical Soul 🎵
                </h2>
              </div>
              {aiLoading ? (
                <div className="flex items-center space-x-4 text-purple-300">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>Analyzing your musical taste...</p>
                </div>
              ) : (
                <p className="text-purple-100 leading-relaxed">{aiSummary}</p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Your Playlists
          </h2>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <Card className="bg-black/40 border-purple-500/20 overflow-hidden backdrop-blur-md">
                    <div className="relative">
                      <Image
                        src={playlist.thumbnails[0]?.url || "/default-thumbnail.jpg"}
                        alt={playlist.title}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover brightness-75 group-hover:brightness-100 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white truncate">{playlist.title}</h3>
                        <p className="text-sm text-purple-300 mt-1">
                          {playlist.count ? `${playlist.count} tracks` : "Collection"}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-900/60">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-purple-300 py-12">
              <Music2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No playlists found. Time to create some music magic!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}