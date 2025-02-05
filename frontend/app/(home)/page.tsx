"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { post } from "../services/pyApi";
import Login from "../components/login";
import { Loader2 } from "lucide-react";
import Landing from "../components/landing";

export default function Home() {
  const [currUID, setCurrUid] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const uid = Cookies.get("uid");
      if (!uid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await post("/validate-uid", { "uid" : uid });

        if (response.success) {
          setCurrUid(uid);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error in validating user ID:", error);
      } finally {
        setIsLoading(false);
      }
    };

    isUserLoggedIn();
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="min-h-screen w-full bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-900">
          <div className="min-h-screen w-full bg-gradient-to-t from-red-500/40 via-red-900/20 to-transparent flex flex-col items-center justify-center">
            <div className="relative">
              <div className="relative z-10">
                <Loader2 className="animate-spin text-white h-14 w-14" />
              </div>
            </div>
            
            <div className="relative mt-4">
              <span className="text-white text-2xl inline-block animate-pulse">
                Loading
                <span className="inline-block animate-bounce">.</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="inline-block animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      ) : isLoggedIn && currUID ? ( 
        <Landing uid={currUID} />
      ) : (
        <Login onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsLoading(true);  
        }} />
      )}
    </div>
  );
}
