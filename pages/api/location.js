import { PrismaClient, Prisma } from '@prisma/client';
import cookie from 'cookie';

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method == 'PATCH') {
        const { latitude, longitude } = req.body;
        const { email, spotify_id } = cookie.parse(req.headers.cookie || '')

        if (!email || !spotify_id) {
            return res.status(401).json({ error: 'No user found' });
        }

        const updatedUser = await prisma.users.update({
            where: {
                email: email,
                spotify_id: spotify_id
            },
            data: {
                lastKnownLatitude: latitude,
                lastKnownLongitude: longitude
            }

        });

        console.log('Successfully updated user location');
        res.status(200).json(updatedUser);

    } else if (req.method == 'GET') {
        const { email, spotify_id } = cookie.parse(req.headers.cookie || '')

        if (!email || !spotify_id) {
            return res.status(401).json({ error: 'No user found' });
        }

        const user = await prisma.users.findUnique({
            where: {
                email: email,
                spotify_id: spotify_id
            }
        });

        const { lastKnownLatitude, lastKnownLongitude } = user;
        res.status(200).json({ lastKnownLatitude, lastKnownLongitude });
        
    } else {
        res.status(405).json({ message: 'Method Not Allowed' })
    }
}  