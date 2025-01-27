"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LandingPage from "@/components/landing";
import LogIn from "@/components/logIn";

export default function Home() {
  const [browserJson, setBrowserJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestHeaders, setRequestHeaders] = useState<string>(""); 

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = Cookies.get("uid");

      if (uid) {
        try {
          const response = await fetch("http://127.0.0.1:8000/get_user_json/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid }),
          });

          if (response.ok) {
            const data = await response.json();
            setBrowserJson(JSON.stringify(data));
            Cookies.set("browser_json", JSON.stringify(data), { expires: 7 });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching user JSON:", error);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleCreateUser = async () => {
    if (!requestHeaders) return alert("Enter browser headers!");

    try {
      const createUserResponse = await fetch("http://127.0.0.1:8000/create_new_user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_headers: requestHeaders }),
      });

      if (createUserResponse.ok) {
        const newUser = await createUserResponse.json();
        if (newUser != null) {
          Cookies.set("uid", newUser.uid, { expires: 7 });

          const newJsonResponse = await fetch("http://127.0.0.1:8000/get_user_json/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: newUser.uid }),
          });

          if (newJsonResponse.ok) {
            const newBrowserJson = await newJsonResponse.json();
            setBrowserJson(newBrowserJson);
            Cookies.set("browser_json", JSON.stringify(newBrowserJson), { expires: 7 });
          }
        }
        
      }
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return browserJson ? (
    <LandingPage userData={browserJson ? JSON.parse(browserJson) : null} />
  ) : (
    <>
      <LogIn setHeaders={setRequestHeaders} />
      <button onClick={handleCreateUser} className="mt-5 p-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </>
  );
}
