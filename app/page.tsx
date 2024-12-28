'use client'
import Image from "next/image";
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [Loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [Position, setPosition] = useState<GeolocationPosition | null>(null);

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('position:', position);
        setPosition(position);
        setLoading(false);
      }, 
      (error) => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );

    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }

  }

  useEffect(() => { getUserLocation() }, []);

  const checkAuth = async () => {
    try { 
        const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (response.status == 401 || response.status == 403) {
          // User is not authenticated, stay on this pgae.
        } else {
          // Session exists already, redirect to home page.
            window.location.href = '/home';
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        window.location.href = '/';
    }
  }

  useEffect(() => { checkAuth() }, []);


  const handleCheckCookies = async () => {
    const cookies = await fetch('/api/cookies', { method: 'GET' });
  }
  return (
    <div >
      <div className="flex justify-center"><h1>Concert Tracker</h1></div>
      <div>
        <p>Login with your Spotify account to track nearby upcoming concerts for your favourite artists. <a href='./login'>Login or signup today!</a></p>
        <button onClick={handleCheckCookies}>Check Current Cookies</button>
      </div>

    </div>
  );
}
