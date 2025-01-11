"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (msg, req, res, next) => {
    if (res.headersSent) {
        return next();
    }
    const statusCode = msg.status || 200;
    const message = msg.message || 'Success';
    res.status(statusCode).json({
        success: true,
        mesage: message,
    });
};
