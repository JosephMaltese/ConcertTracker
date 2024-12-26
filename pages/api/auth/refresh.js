import cookie from 'cookie';
const clientId = '5d30b8aba0d24d2d82908d26f24fdb95';
const url = "https://accounts.spotify.com/api/token";

export default async function handler(req, res) {
    try {

        const { refresh_token: refreshToken } = cookie.parse(req.headers.cookie || '');
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        

        const payload = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: clientId
            }),
          };
        const response = await fetch(url, payload);
        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ error: data.error });
        }

        const { access_token: newAccessToken, refresh_token: newRefreshToken} = data;
        res.setHeader('Set-Cookie', cookie.serialize(
            'access_token',
            newAccessToken,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 // 1 hour
            })
        );
        
        if (newRefreshToken) {
            res.setHeader(cookie.serialize(
                'refresh_token',
                newRefreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 7 days
                }
            ));
        }

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}