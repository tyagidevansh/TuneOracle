"use client";
import { post } from "@/app/services/pyApi";
import { useEffect, useState, use, Suspense } from "react";
import Cookies from "js-cookie";
import { Music, Sparkles, Radio, Loader2 } from "lucide-react";
import { useMemo } from "react";

interface PlaylistIdPage {
  params: Promise<{
    playlistId: number;
  }>;
}

interface PlaylistData {
  title: string;
  trackCount: number;
  tracks: Array<string>;
  thumbnail: string;
  related: Array<{
    title: string;
    playlistId: string;
    thumbnails: [
      {
        url: string;
        width: number;
        height: number;
      }
    ];
    description: string;
  }>;
  playlist_info: {
    playlist_id: string;
    happy: string;
    energy: string;
    obscure: string;
  };
}

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const ScrollingBackground = ({ tracks }: { tracks: string[] }) => {
  
  const shuffledTracksList = useMemo(() => {
    return [...Array(15)].map(() => shuffleArray(tracks));
  }, [tracks]);

  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden opacity-35 z-0">
      {shuffledTracksList.map((shuffledTracks, index) => (
        <div
          key={index}
          className="absolute flex whitespace-nowrap"
          style={{
            top: `${index * 7}vh`, 
            animationDuration: `${80 + index * 15}s`, 
            willChange: "transform", 
          }}
        >
          <div
            className={`whitespace-nowrap inline-block ${
              index % 2 === 0 ? "animate-scroll-left" : "animate-scroll-right"
            }`}
          >
            {shuffledTracks.map((track, i) => (
              <span
                key={i}
                className="mx-12 text-5xl font-bold text-gray-500 inline-block"
                style={{
                  opacity: Math.random() * 0.5 + 0.5,
                }}
              >
                {track}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CircularMeter = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <div className="relative w-64 h-64 group">
    <div className="absolute inset-0 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-1000" />

    <div className="absolute inset-4 bg-gradient-to-br from-red-950 to-black rounded-full" />

    <svg className="w-full h-full transform -rotate-90 relative z-10">
      <circle
        cx="128"
        cy="128"
        r="120"
        className="fill-none stroke-red-900/20"
        strokeWidth="12"
      />
      <circle
        cx="128"
        cy="128"
        r="120"
        className="fill-none stroke-red-500"
        strokeWidth="12"
        strokeDasharray={`${parseFloat(value) * 7.54} 754`}
        style={{
          transition: "stroke-dasharray 2s ease-in-out",
          filter: "drop-shadow(0 0 12px rgba(239, 68, 68, 0.3))",
        }}
      />
    </svg>

    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {icon}
      <span className="text-5xl font-bold text-white mt-4 group-hover:scale-110 transition-transform duration-500">
        {value}%
      </span>
      <span className="text-xl text-gray-400 mt-2">{label}</span>
    </div>
  </div>
);

const PlaylistContent = ({ playlistId }: { playlistId: number }) => {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const uid = Cookies.get("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/playlist-content", {
          uid: uid,
          playlist_id: playlistId,
        });
        if (response["data"]) {
          setPlaylistData(response["data"]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [playlistId, uid]);

  if (isLoading || !playlistData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-900">
        <div className="min-h-screen w-full bg-gradient-to-t from-red-500/40 via-red-900/20 to-transparent flex flex-col items-center justify-center">
          <div className="relative">
            <div className="relative z-10">
              <Loader2 className="animate-spin text-white h-14 w-14" />
            </div>
          </div>
          
          <div className="relative mt-4">
            <span className="text-white text-2xl inline-block animate-pulse">
              Getting your playlist data
              <span className="inline-block animate-bounce">.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
            </span>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ScrollingBackground tracks={playlistData.tracks} />

      <div className="relative z-10 container mx-auto p-8">
        <div className="min-h-screen flex flex-col">
          <div className="flex items-center gap-6 mb-12">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={playlistData.thumbnail}
                alt="Playlist Art"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/api/placeholder/128/128";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-lg" />
            </div>
            <h1 className="text-4xl font-bold">{playlistData.title}</h1>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <CircularMeter
                value={playlistData.playlist_info.happy}
                label="Happiness"
                icon={<Music className="w-12 h-12 text-red-400" />}
              />
              <CircularMeter
                value={playlistData.playlist_info.energy}
                label="Energy"
                icon={<Sparkles className="w-12 h-12 text-red-400" />}
              />
              <CircularMeter
                value={playlistData.playlist_info.obscure}
                label="Obscurity"
                icon={<Radio className="w-12 h-12 text-red-400" />}
              />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">
              Here&apos;s some users who made playlists similar to yours
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {playlistData.related.map((playlist) => (
                <a
                  key={playlist.playlistId}
                  href={`https://music.youtube.com/playlist?list=${playlist.playlistId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative h-24 overflow-hidden rounded-lg bg-red-950/30">
                    <img
                      src={playlist.thumbnails[0].url}
                      alt={playlist.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/96/96";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <p className="text-sm font-medium truncate">
                        {playlist.title}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes scrollRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scrollLeft 4000s linear infinite;
        }

        .animate-scroll-right {
          animation: scrollRight 4000s linear infinite;
        }
      `}</style>
    </div>
  );
};

const PlaylistPage = ({ params }: PlaylistIdPage) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        </div>
      }
    >
      <PlaylistContent playlistId={use(params).playlistId} />
    </Suspense>
  );
};

export default PlaylistPage;
