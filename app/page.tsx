import Image from "next/image";

export default function Home() {
  return (
    <div >
      <div className="flex justify-center"><h1>Concert Tracker</h1></div>
      <div>
        <p>Login with your Spotify account to track nearby upcoming concerts for your favourite artists. <a href='./login'>Login or signup today!</a></p>
      </div>

    </div>
  );
}
