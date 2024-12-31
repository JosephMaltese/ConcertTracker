import React from 'react'
import SpotifyLogin from './SpotifyLogin'

const LandingContent = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
            <img
            src="concertImage.jpeg"
            className="max-w-md rounded-lg shadow-2xl" />
            <div>
            <h1 className="text-7xl w-full text-left font-bold">Concert Tracker</h1>
            <p className="py-6">
                A convenient and easy-to-use platform that finds upcoming concerts in your area based on your favourite Spotify artists.
                Login or signup with your <span className="text-green-500">Spotify</span> account today to get started!
            </p>
            <SpotifyLogin />
            </div>
        </div>
</div>
  )
}

export default LandingContent
