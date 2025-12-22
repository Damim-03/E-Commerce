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
exports.onlyAdmin = exports.protectRoute = void 0;
const express_1 = require("@clerk/express");
const user_model_1 = require("../../models/users/user.model");
const env_1 = require("../../config/env");
const error_handler_1 = require("../../helpers/ERRORS/error-handler");
const unathorized_1 = require("../../helpers/UNAUTHORIZED/unathorized");
const not_found_1 = require("../../helpers/NOT-FOUND/not-found");
const root_1 = __importStar(require("../../helpers/ROOTS/root"));
exports.protectRoute = [
    (0, express_1.requireAuth)(),
    (0, error_handler_1.errorHandler)(async (req, res, next) => {
        const clerkId = req.auth().userId;
        if (!clerkId) {
            throw new unathorized_1.UnauthorizedException("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED);
        }
        const user = await user_model_1.User.findOne({ clerkId });
        if (!user) {
            throw new not_found_1.NotFoundException("User not found", root_1.ErrorCodes.USER_NOT_FOUND);
        }
        req.user = user;
        next();
    })
];
const onlyAdmin = (req, res, next) => {
    if (!req.user) {
        throw new unathorized_1.UnauthorizedException("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED);
    }
    if (req.user.email !== env_1.ADMIN_EMAIL) {
        throw new root_1.default("Forbidden. Admins only", root_1.ErrorCodes.UNAUTHORIZED, 403);
    }
    next();
};
exports.onlyAdmin = onlyAdmin;
