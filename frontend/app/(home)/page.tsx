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
            <Loader2 className="animate-spin text-white h-14 w-14"/>
            <span className="text-white text-2xl mt-4">Loading...</span>
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
