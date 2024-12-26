import exp from "constants";
import cookie from 'cookie';


export default async function handler(req, res) {
    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        console.log('Current Cookies:', cookies);
        const { auth_token: token, access_token: accessToken, refresh_token: refreshToken, email: email, display_name: displayName, spotify_id: spotifyId } = cookies;
        if (!token || !accessToken || !refreshToken) {
            return res.status(400).json({ error: 'Missing required cookies' });
        }

        res.setHeader(
            'Set-Cookie',
            [
                cookie.serialize('auth_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
                cookie.serialize('access_token', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
                cookie.serialize('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
                cookie.serialize('display_name', displayName, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
                cookie.serialize('email', email, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
                cookie.serialize('spotify_id', spotifyId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 0,
                }),
            ]);
        return res.status(200).json({ message: 'Success! User Logged out.' });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ error: 'An error occurred during logout' });
    }
    
}