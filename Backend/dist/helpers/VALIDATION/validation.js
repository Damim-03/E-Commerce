"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntity = void 0;
const root_1 = __importDefault(require("../ROOTS/root"));
class UnprocessableEntity extends root_1.default {
    constructor(error, message, errorCode) {
        super(message, errorCode, 422, error);
    }
}
exports.UnprocessableEntity = UnprocessableEntity;
