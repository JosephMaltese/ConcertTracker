import React from 'react'
import { useRouter } from 'next/navigation';

const Header = () => {
    const router = useRouter();

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
        <div className="navbar bg-base-200 flex items-center justify-between">
          {/* Left Section: Logout Button */}
          <div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-secondary"
              style={{ position: 'absolute', top: '10px', left: '10px' }}
            >
              Logout
            </button>
          </div>
      
          {/* Center Section: Concert Tracker */}
          <div className="flex-1 text-center ml-[35%]">
            <h1>Concert Tracker</h1>
          </div>
      
          {/* Right Section: Icon Button */}
          <div>
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      );
}

export default Header