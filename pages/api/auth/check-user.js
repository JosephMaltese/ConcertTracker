import cookie from 'cookie';

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;
    console.log('Hemtoj:', cookies);

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token found' });
    }
  
    
    // get current spotify user
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }

        });

        if (!response.ok) {
            throw new Error(`Error; ${response.status} ${response.statusText}`)
        }

        const data = await response.json();
        console.log("Spotify User Data:", data);

        const displayName = data.display_name;
        console.log("Display name:", displayName);

        const email = data.email;
        console.log("Email:", email);

        const spotifyId = data.id;
        console.log("Spotify Id:", spotifyId);

        const oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
        const newCookies = [
            cookie.serialize('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: oneHourFromNow,
              }),
            cookie.serialize('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: sevenDaysFromNow,
              }),
            cookie.serialize('display_name', displayName, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: sevenDaysFromNow,
            }),
            cookie.serialize('email', email, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: sevenDaysFromNow,
            }),
            cookie.serialize('spotify_id', spotifyId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: sevenDaysFromNow,
            }),
          ];
          
        res.setHeader('Set-Cookie', newCookies);
        res.redirect('/api/auth/login');


    } catch (error) {
        console.error("Failed to fetch Spotify user data:", error);
        throw error;
    }

    // return res.status(200).json({ message: 'Access token received', accessToken });

}