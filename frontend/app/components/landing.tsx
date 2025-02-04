"use client";

import { useEffect, useRef, useState } from "react";
import { post } from "../services/pyApi";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Music2, LogIn, AudioWaveform} from "lucide-react";
import { useRouter } from "next/navigation";

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
  const aiSummaryRef = useRef<string | null>(null)
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userDetails, playlistData] = await Promise.all([
          post("/profile-details", { uid }),
          post("/playlists", { uid })
        ]);
        setUserData(userDetails);
        setPlaylists(playlistData?.data || []);
        setLoading(false);
        
        fetchAiSummary();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchAiSummary = async () => {
      try {
        const summaryData = await post("/ai-summary", { uid });
        aiSummaryRef.current = summaryData?.data || "No summary available.";
      } catch (error) {
        console.error("Error fetching AI summary:", error);
      } finally {
        setAiLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-900">
        <div className="min-h-screen w-full bg-gradient-to-t from-red-500/40 via-red-900/20 to-transparent flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-white h-14 w-14"/>
        <span className="text-white text-2xl mt-4">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-red-800 text-white relative overflow-hidden">
      <div className="fixed inset-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(220, 38, 38, 0.4) 0%, transparent 20%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(220, 38, 38, 0.3) 0%, transparent 30%),
              radial-gradient(circle at ${mousePosition.y}% ${mousePosition.x}%, rgba(220, 38, 38, 0.2) 0%, transparent 25%)
            `
          }}
        />
        
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-64 w-2 bg-red-600 rounded-full animate-float"
              style={{
                left: `${i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px] opacity-65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {userData && (
          <>
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-8 mb-16 bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 animate-fade-in hover:bg-white/10 transition-all duration-500">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-red-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
                <Image
                  src={userData.accountPhotoUrl}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="relative rounded-full border-2 border-white/50 group-hover:border-red-500 transition-all duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-2 animate-bounce">
                  <Music2 className="h-5 w-5" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent animate-gradient">
                    Welcome, {userData.accountName}!
                  </span>
                </h1>
                <p className="text-red-300">{userData.channelHandle}</p>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 p-6 mb-12 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 animate-slide-up">
              <CardContent>
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                    Your Musical Soul 🎵
                  </h2>
                </div>
                {aiLoading ? (
                  <div className="flex items-center space-x-4 text-red-300 h-24">
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                      <Loader2 className="animate-spin relative" />
                    </div>
                    <p className="animate-pulse">Discovering your unique taste in music...</p>
                  </div>
                ) : (
                  <p className="text-gray-200 leading-relaxed">{aiSummaryRef.current}</p>
                )}
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent animate-gradient">
              Your Playlists
            </h2>
            <h3 className="text-xl font-bold mb-8 bg-gradient-to-r from-red-300 to-red-200 bg-clip-text text-transparent animate-gradient">
              Click on any playlist to get a detailed AI analysis
            </h3>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => {router.push(`/playlists/${playlist.playlistId}`)}}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg opacity-0 group-hover:opacity-75 transition duration-500 blur"></div>
                    <Card className="relative bg-white/5 border-white/10 overflow-hidden backdrop-blur-sm">
                      <div className="relative">
                        <Image
                          src={playlist.thumbnails[0]?.url || "/default-thumbnail.jpg"}
                          alt={playlist.title}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-red-300 transition-colors duration-300">
                            {playlist.title}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {playlist.count ? `${playlist.count} tracks` : "Collection"}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/60">
                        <LogIn className="w-12 h-12 text-red-500 animate-pulse" />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-red-300 py-12 animate-fade-in">
                <Music2 className="h-12 w-12 mx-auto mb-4 opacity-50 animate-bounce" />
                <p>No playlists found. Time to create some music magic!</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(100vh); }
          50% { transform: translateY(-100%); }
        }
        @keyframes sound-wave {
          0%, 100% { height: 20%; }
          50% { height: 60%; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}