"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_URL = exports.ADMIN_EMAIL = exports.INNGEST_SIGNING_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLERK_SECRET_KEY = exports.CLERK_PUBLISHABLE_KEY = exports.MONGO_URI = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
exports.PORT = process.env.PORT;
exports.NODE_ENV = process.env.NODE_ENV;
exports.MONGO_URI = process.env.MONGO_URI;
exports.CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY;
exports.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY;
exports.ADMIN_EMAIL = process.env.ADMIN_EMAIL;
exports.CLIENT_URL = process.env.CLIENT_URL;
