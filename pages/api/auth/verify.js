import verifyJWT from "../../../middleware/auth";

export default function handler(req, res) {
    verifyJWT(req, res, () => { 
        console.log('Heres the current user:', req.user);
        return res.status(200).json({ user: req.user });
    });
}