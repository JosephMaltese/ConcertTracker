import { PrismaClient } from '@prisma/client'
import cookie from 'cookie';
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET;
import jwt from 'jsonwebtoken';

export default async function handler (req, res) {
    console.log('Welcome To Login!!!');

    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        console.log('Heres the current cookies:', cookies);

        const { display_name: displayName, email, spotify_id: spotifyId, access_token: accessToken, refresh_token: refreshToken } = cookies;

        if (!spotifyId || !accessToken || !refreshToken) {
            return res.status(400).json({ error: 'Missing required cookies' });
        }

        const user = await initializeUser({ displayName, email, spotifyId });

        const token = jwt.sign({id : user.id, spotify_id: user.spotify_id, display_name: user.display_name }, JWT_SECRET, { expiresIn: '1h' });

        // Set the JWT and Spotify tokens as cookies
        res.setHeader('Set-Cookie', [
            cookie.serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 3600, // 1 hour
            }),
            cookie.serialize('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 3600, // 1 hour (matches Spotify token expiry)
            }),
            cookie.serialize('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            }),
        ]);

        console.log("User logged in with JWT:", token);

        res.writeHead(302, { Location: '/home' });
        res.end();
        // return res.status(200).json({ message: 'Success! User Logged in.', user});
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }

}

async function initializeUser({ displayName, email, spotifyId }) {
    let user = await prisma.users.findUnique({
        where: {
            spotify_id: spotifyId,
        },
    });
    if (user) {
        console.log('User found:', user);
        return user;
    } else {
        user = await prisma.users.create({
            data: {
                spotify_id: spotifyId,
                display_name: displayName,
                email: email,
            }
        });
        console.log('New user created:', user);
        return user;
    }    
  }