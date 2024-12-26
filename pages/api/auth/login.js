import { PrismaClient } from '@prisma/client'
import cookie from 'cookie';
const prisma = new PrismaClient()

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

        return res.status(200).json({ message: 'Success!', user});
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