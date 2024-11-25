'use client'

import LandingPage from '@/components/landing';
import LogIn from '@/components/logIn';
import { useEffect, useState } from 'react';

interface UserData {
  accountName: string,
  channelHandle: string,
  accountPhotoUrl: string,
}

export default function Home() {
  const [cookies, setCookies] = useState("");
  const [loggedIn, setLoggedIn] = useState<Boolean>(false);
  const [userInfo, setUserInfo] = useState<UserData>();
  
  const checkLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response) {
        const data = await response.json()
        setLoggedIn(true);
        setUserInfo(data);
        console.log(data);
      } 
    } catch (error) {
      console.log("login check error : ", error)
    }
  }

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => { 
    console.log(cookies);
  }, [cookies]);

  return (
    <div className='bg-gradient-to-b from-black to-gray-900 min-h-screen'>
      {
        loggedIn && userInfo ? (
          <LandingPage userData={userInfo}/>
        ) : (
          <LogIn />
        )
      }          
    </div>
  );
}
