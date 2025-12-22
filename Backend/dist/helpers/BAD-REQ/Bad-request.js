"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestsException = void 0;
const root_1 = __importDefault(require("../ROOTS/root"));
class BadRequestsException extends root_1.default {
    constructor(message, errorCode, zodError) {
        super(message, errorCode, 422, zodError ? zodError.issues : null);
    }
}
exports.BadRequestsException = BadRequestsException;
