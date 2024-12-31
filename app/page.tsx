'use client'
import React, { useEffect, useState } from 'react';
import LandingContent from './components/LandingContent';

export default function Home() {

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
      <LandingContent />
    </div>
  );
}


// <button onClick={handleCheckCookies}>Check Current Cookies</button>