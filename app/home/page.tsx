'use client'
import React, { useState, useEffect } from 'react';
const ngeohash = require('ngeohash');
import Card from '../components/Card';
import Header from '../components/Header';

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

interface Artist {
    external_urls: {spotify: string},
    followers: {href: null, total: number},
    genres: string[],
    href: string,
    id: string,
    images: {height: number, url: string, width: number}[],
    name: string,
    popularity: number,
    type: string,
    uri: string
}

const page = () => {
    const [User, setUser] = useState<User | null>(null);
    const [LoadingConcerts, setLoadingConcerts] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [Position, setPosition] = useState<GeolocationPosition | null>(null);
    const [topartists, setTopartists] = useState<Artist[]>([]);
    const [Concerts, setConcerts] = useState<any[]>([]);

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

    const getConcerts = async (location: Location, topArtists: Artist[]) => {
        const latitude = location.lastKnownLatitude;
        const longitude = location.lastKnownLongitude;

        const geoHash = latitude && longitude ? ngeohash.encode(latitude, longitude) : null;

        const allConcerts = [];

        for (const artist of topArtists) {
            const artistName = artist.name;
            try {
                const attractionId = await getAttractionId(artistName);
                const response = await fetch(`/api/concerts?attractionId=${attractionId}&geoHash=${geoHash}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }});
                if (!response.ok) {
                    console.error(`Failed to fetch concerts for artist ${artist.name}`);
                    continue; // Skip this artist if there's an error
                }
                const data = await response.json();
                const concerts = data._embedded?.events || [];
                allConcerts.push(...concerts);

            } catch (error) {
                console.error('Error getting concerts for artist:', artistName, error);
            }
        }
        setConcerts(allConcerts);
        return allConcerts;
    }

    const getTopArtists = async () => {
        const response = await fetch('api/artists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const artists = await response.json();
            const artistArray = artists.artists;

            if (Array.isArray(artistArray) && artistArray.length > 0) {
                return artistArray;
            }
        }
        return [];
    }

    const getAttractionId = async (artistName: string) => {
        try {
            const response = await fetch(`/api/attractions?artistName=${encodeURIComponent(artistName)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error(`Failed to get attraction ID for artist ${artistName}`);
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting attraction ID for artist:', artistName, error);
            return null;
        }
    }


    const getUserLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
            setPosition(position);

            const [_, topArtists] = await Promise.all([
                setLocationInDatabase(position.coords.latitude, position.coords.longitude),
                getTopArtists()
            ]);
            console.log('Successfully fetched top artists:', topArtists);
            setTopartists(topArtists);


            console.log('Fetching concerts!');
            // Get relevant concerts based on location and favourite artists
            const concerts = await getConcerts({ lastKnownLatitude: position.coords.latitude, lastKnownLongitude: position.coords.longitude}, topArtists);
            setLoadingConcerts(false);
            console.log('Successfully fetched concerts:', concerts);


          }, 
          async (error: GeolocationPositionError) => {
            setError('Unable to retrieve your location');
    
            // Should then get concerts based on last known location. If no such location, then get all concerts pertaining to favourite artists.
            const lastKnownLocation = await getLastKnownLocation();

            // Should then get favourite artists
            const topArtists = await getTopArtists();
            setTopartists(topArtists);

            const concerts = await getConcerts({lastKnownLatitude: lastKnownLocation.lastKnownLatitude, lastKnownLongitude: lastKnownLocation.lastKnownLongitude}, topArtists);
            setLoadingConcerts(false);
            console.log('Successfully fetched concerts:', concerts);
        }
        );
    
        } else {
          setError('Geolocation is not supported by this browser.');

          // Should then get favourite artists
          const topArtists = await getTopArtists();
          setTopartists(topArtists);

          // Get concerts based on favourite artists (ANY LOCATION)
          const concerts = await getConcerts({lastKnownLatitude: null, lastKnownLongitude: null}, topArtists);
          setLoadingConcerts(false);
          console.log('Successfully fetched concerts:', concerts);
        }
    
      }
    
    useEffect(() => { 
        checkAuth();
        getUserLocation();
    }, []);

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

    const handleCheckCookies = async () => {
        const cookies = await fetch('/api/cookies', { method: 'GET' });
      }

  return (
        <div>
            <Header />
            <div className="flex flex-col justify-center items-center mt-6">
                {!User ? (<span className="loading loading-dots loading-lg"></span>) : error ? (<p>{error}</p>) : (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {User && <h2 className="mb-12 text-2xl">Welcome, {User.display_name}</h2>}
                        <div className="flex flex-col justify-center items-center">
                            <h2 className='mb-4 text-base'>Nearby Upcoming Concerts Based On Your Favourite Spotify Artists</h2>
                            {!LoadingConcerts ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {Concerts.map((concert, index) => {
                                return (<div key={index}>
                                    <Card imageUrl={concert.images[0].url} width={concert.images[0].width} height={concert.images[0].height} eventName={concert.name} venue={concert._embedded.venues[0].name} city={concert._embedded.venues[0].city.name} province={concert._embedded.venues[0].state.stateCode} date={concert.dates.start.localDate} ticketmasterLink={concert.url} />
                                </div>);
                                })}
                            </div>) : (<span className="loading loading-spinner text-primary loading-lg mt-14"></span>) }
                        </div>
                    </div>
                )}
            </div>
        </div>
  )
}


export default page

// <button onClick={handleCheckCookies}>Check Current Cookies</button>
