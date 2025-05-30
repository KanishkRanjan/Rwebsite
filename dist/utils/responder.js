"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}
exports.default = CustomResponse;
