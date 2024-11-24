'use client'

import { Input } from '@/components/ui/input';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

export default function Home() {
  const [cookies, setCookies] = useState("");
  const [loggedIn, setLoggedIn] = useState<Boolean>(false);
  const [userInfo, setUserInfo] = useState();
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCookies(event.target.value);
  }

  const checkLogin = async () => {
    try {
      const response = await fetch('https://localhost:8000/', {
        method: 'GET',
        headers: {
          ContentType: 'application/json',
        }
      });

      if (response) {
        setLoggedIn(true);
        setUserInfo(response) //add type info
      } 
      
    } catch (error) {

    }
  }

  useEffect(() => { 
    console.log(cookies);
  }, [cookies]);

  return (
    <div className='bg-gradient-to-b from-black to-gray-900 min-h-screen'>
      <div className='text-white text-3xl text-center p-10'>
        YT MUSIC ANALYSIS THINGY idk rn
      </div>
      <div className='mt-16 w-[60%] mx-auto'>
        <Input type="text" placeholder="Enter browser cookies 😈" onChange={handleInputChange}/>
      </div>
    </div>
  );
}
