import cookie from 'cookie';
export default function handler(req, res) {
    const cookies = req.headers.cookie;
    console.log('Current Cookies (Button Check):', cookies);
    res.status(200).json({ cookies });
}