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

interface Location {
    lastKnownLatitude: number | null;
    lastKnownLongitude: number | null;
}

const page = () => {
    const router = useRouter();
    const [User, setUser] = useState<User | null>(null);

    const [Loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [Position, setPosition] = useState<GeolocationPosition | null>(null);

    const getLastKnownLocation = async (): Promise<Location> => {
        try {
            const response = await fetch('/api/location', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const location = await response.json();
                return location;

            } else {
                console.log('Failed to get last known location');
                return { lastKnownLatitude: null, lastKnownLongitude: null };
            }

        }
        catch (error) {
            console.error('Error getting last known location:', error);
            return { lastKnownLatitude: null, lastKnownLongitude: null };
        }
    }

    const setLocationInDatabase = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch('/api/location', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            if (response.ok) {
                console.log('Successfully set location in database');
            } else {
                console.log('Failed to set location in database');
            }

        } catch (error) {
            console.error('Error setting location in database:', error);
        }
    }

    const getConcerts = async () => {

    }



    

    const handleLocationError = async (error: GeolocationPositionError) => {
        setError('Unable to retrieve your location');
        setLoading(false);

        // Should then get concerts based on last known location. If no such location, then get all concerts pertaining to favourite artists.
        const lastKnownLocation = await getLastKnownLocation();
        if (lastKnownLocation.lastKnownLatitude && lastKnownLocation.lastKnownLongitude) {
            // Get concerts based on last known location
        } else {
            // Get concerts based on favourite artists
        }


    }

    const getUserLocation = async () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            console.log('position:', position);
            setPosition(position);
            setLoading(false);

            // Should then set last known location in database
            setLocationInDatabase(position.coords.latitude, position.coords.longitude);

            // Should then get favourite artists

            // And then get relevant concerts based on location
          }, 
          handleLocationError
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
                window.location.href = '/';
            } else {
                const user = await response.json();
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
                <p>Loading user data...</p>
            )}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleCheckCookies}>Check Current Cookies</button>
      {Loading && <p>Loading your location...</p>}
      {Position && <p>Your location is: Latitude: {Position?.coords.latitude}, Longitude: {Position?.coords.longitude}</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default page
