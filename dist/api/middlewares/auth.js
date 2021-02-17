"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validateSession(req, res, next) {
    const accessToken = req.header('user-access-token');
    if (!accessToken)
        return res.status(401).send('Access denied.');
    try {
        const verifiedToken = jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET);
        req.user = verifiedToken;
        next();
    }
    catch (err) {
        res.status(400).send('Invalid token.');
    }
}
exports.validateSession = validateSession;
