"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    label: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    PhoneNumber: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    clerkId: {
        type: String,
        unique: true,
        required: true
    },
    address: [addressSchema],
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
