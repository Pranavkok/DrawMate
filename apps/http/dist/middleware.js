import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export function middleware(req, res, next) {
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "UnAuthorized"
        });
    }
}
