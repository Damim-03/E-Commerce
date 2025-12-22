"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalException = void 0;
const root_1 = __importDefault(require("../ROOTS/root"));
class InternalException extends root_1.default {
    constructor(message, errors, errorCode) {
        super(message, errorCode, 500, errors);
    }
}
exports.InternalException = InternalException;
