'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    display_name: string;
    exp: number;
    iat: number;
    id: number;
    spotify_id: string;
}

const page = () => {
    const router = useRouter();
    const [User, setUser] = useState<User | null>(null);

    const getCurrentUser = async () => {

    }

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
                window.location.href = '/';
            } else {
                const user = await response.json();
                console.log('Fetched user:', user); // Debugging
                setUser(user.user);
            }

        } catch (error) {
            console.error('Error verifying user:', error);
            window.location.href = '/';
        }
    }

    useEffect(
        () => {
            checkAuth();
        }, []
    )

    // Log the user object whenever it changes
    useEffect(() => {
        if (User) {
            console.log('User updated:', User);
            console.log('User display_name:', User.display_name);  // Log specific field to check
        }
    }, [User]);

    const handleCheckCookies = async () => {
        const cookies = await fetch('/api/cookies', { method: 'GET' });
      }

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                router.push('/')
            } else {
                console.error("Failed to log out")
            }

        } catch (error) {
            console.error("An error occurred while logging out", error);
        }

    }
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {User ? (
                <h1>Welcome, {User.display_name}</h1>
            ) : (
                <p>Loading user data...</p>  // Fallback loading message
            )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleCheckCookies}>Check Current Cookies</button>
    </div>
  )
}

export default page
