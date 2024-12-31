'use client';
import React from 'react';

const clientId = '5d30b8aba0d24d2d82908d26f24fdb95';
const redirectUri = 'http://localhost:3000/api/auth/callback';
const scope = 'user-top-read user-read-private user-read-email';

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

const sha256 = async(plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}


const SpotifyLogin = () => {

    const handleLogin = async () => {
        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        // Store code_verifier in cookies
        document.cookie = `code_verifier=${codeVerifier}; path=/`;

        const authUrl = new URL("https://accounts.spotify.com/authorize")
        const params =  {
            response_type: 'code',
            client_id: clientId,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        }
        
          
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    return (<button onClick={handleLogin} className="btn btn-primary">Get Started</button>);
}

export default SpotifyLogin;