import jwt from 'jsonwebtoken';
import cookie from 'cookie';
const secret = process.env.JWT_SECRET;
export default function verifyJWT(req, res, next) {
    const { auth_token } = cookie.parse(req.headers.cookie || '');

    if (!auth_token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(auth_token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}