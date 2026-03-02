import jwt from 'jsonwebtoken';

const JWT_SECRET = 'aura_home_secret_key_2024';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.type; // 'admin', 'agent', 'user'
        req.userStatus = decoded.status; // e.g., 'approved' for agents
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json({ success: false, error: 'Forbidden: insufficient role' });
        }
        next();
    };
};

export const requireApprovedAgent = (req, res, next) => {
    if (req.userRole !== 'agent' || req.userStatus !== 'approved') {
        return res.status(403).json({ success: false, error: 'Forbidden: agent must be approved' });
    }
    next();
};
