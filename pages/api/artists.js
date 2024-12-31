import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const cookies = cookie.parse(req.headers.cookie || '');
            console.log('Current Cookies:', cookies);

            let accessToken = cookies.access_token;

            if (!accessToken) {
                response = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    return res.status(400).json({ error: 'Unauthorized' });
                }
                const data = await response.json();
                accessToken = data.accessToken;
            }


            const timeRange = 'medium_term';
            const limit = 20;

            const spotifyResponse = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
            });


            if (spotifyResponse.status !== 200) { 
                console.log("error: ", spotifyResponse);
                return res.status(400).json({ error: 'Failed to fetch data' });
            }


            const spotifyData = await spotifyResponse.json();

            console.log('Spotify Top Artist Data:', spotifyData);


            res.status(200).json({ artists: spotifyData.items });

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }

    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}