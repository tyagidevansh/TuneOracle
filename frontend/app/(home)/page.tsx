"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { post } from "../services/pyApi";

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
        const response = await post("/validate-uid/", {"uid" : uid} );

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
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isLoggedIn ? (
        <div>Welcome, user {currUID}!</div>
      ) : (
        <div>Please log in.</div>
      )}
    </>
  );
}
