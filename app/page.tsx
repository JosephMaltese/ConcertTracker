'use client'
import Image from "next/image";

export default function Home() {

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
