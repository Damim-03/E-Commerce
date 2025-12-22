"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = void 0;
const root_1 = __importDefault(require("../ROOTS/root"));
class UnauthorizedException extends root_1.default {
    constructor(message, errorCode, errors) {
        super(message, errorCode, 401, errors);
    }
}
exports.UnauthorizedException = UnauthorizedException;
