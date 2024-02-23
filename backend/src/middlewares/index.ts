import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    userId: number; // Adjust the type according to your userId type
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Unauthorized: Missing or invalid authorization header." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // @ts-ignore
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized: Invalid token." });
        }
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(403).json({ message: "Unauthorized: Token verification failed." });
    }
};

export { authMiddleware };
