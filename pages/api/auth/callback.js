import cookie from 'cookie';

export default async function handler(req, res) {
    const clientId = '5d30b8aba0d24d2d82908d26f24fdb95';
    const redirect_uri = 'http://localhost:3000/api/auth/callback';
    const { code } = req.query;
    
    if (!code) {
        return res.redirect('/login');
    } 


    const codeVerifier = req.cookies.code_verifier; // Retrieve code_verifier from cookies
    if (!codeVerifier) {
      return res.status(400).json({ error: 'Code verifier is missing' });
    }

    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri,
        code_verifier: codeVerifier,
      }),
    }


    try {
      const body = await fetch(url, payload);
      const response = await body.json();

      if (response.error) {
        console.error('API Error:', response.error);
        return res.status(400).json({ error: response.error });
      }
      console.log('Response:',response);
      
      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      if (!accessToken) {
        throw new Error('Access token is missing in the response.');
      }
      if (!refreshToken) {
        throw new Error('Refresh token is missing in the response.');
      }

      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      const oneHourFromNow = new Date();
      oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      // Set cookie
      res.setHeader('Set-Cookie', [ cookie.serialize('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: oneHourFromNow,
      }), cookie.serialize('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: sevenDaysFromNow,
      }),
       cookie.serialize('code_verifier', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Adjust for environment
        sameSite: 'strict', // Protect against CSRF
        path: '/', // Ensure site-wide availability
        expires: new Date(0), // Set expiration to the past
      })
    ]);

      console.log('Set-Cookie Header:', res.getHeader('Set-Cookie'));
  
      // Redirect
      res.redirect('/api/auth/check-user');
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tokens' });
    }
}
  