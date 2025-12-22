"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const root_1 = __importStar(require("../ROOTS/root"));
const internal_exception_1 = require("./internal-exception");
const zod_1 = require("zod");
const Bad_request_1 = require("../BAD-REQ/Bad-request");
const errorHandler = (method) => {
    return async (req, res, next) => {
        try {
            await method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.default) {
                // Already a known exception → pass through
                exception = error;
            }
            else if (error instanceof zod_1.ZodError) {
                // Validation error → 422 Bad Request
                exception = new Bad_request_1.BadRequestsException("Unprocessable entity", root_1.ErrorCodes.UNPROCESSABLE_ENTITY, error);
            }
            else {
                // Unknown error → 500 Internal Server Error
                exception = new internal_exception_1.InternalException("Something went wrong!", error, root_1.ErrorCodes.INTERNAL_EXCEPTION);
            }
            next(exception);
        }
    };
};
exports.errorHandler = errorHandler;
