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
exports.deleteAddress = exports.updateAddress = exports.getAddresses = exports.addAddress = void 0;
const root_1 = __importStar(require("../../../helpers/ROOTS/root"));
const addAddress = async (req, res, next) => {
    try {
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault, } = req.body;
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        // Validate required fields
        if (!streetAddress || !city || !zipCode) {
            return next(new root_1.default("Street address, city, and zip code are required", root_1.ErrorCodes.MISSING_REQUIRED_FIELDS, 422));
        }
        // 🔹 إذا العنوان الجديد default → ألغِ القديم
        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false,
        });
        await user.save();
        return res.status(201).json({
            message: "Address added successfully",
            addresses: user.addresses,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.addAddress = addAddress;
const getAddresses = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        return res.status(200).json({
            addresses: user.addresses || [],
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.getAddresses = getAddresses;
const updateAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;
        const { label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault, } = req.body;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        const address = user.addresses.id(addressId);
        if (!address) {
            return next(new root_1.default("Address not found", root_1.ErrorCodes.ADDRESS_NOT_FOUND, 404));
        }
        // 🔹 لو العنوان الجديد default → ألغِ البقية
        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        if (label !== undefined)
            address.label = label;
        if (fullName !== undefined)
            address.fullName = fullName;
        if (streetAddress !== undefined)
            address.streetAddress = streetAddress;
        if (city !== undefined)
            address.city = city;
        if (state !== undefined)
            address.state = state;
        if (zipCode !== undefined)
            address.zipCode = zipCode;
        if (phoneNumber !== undefined)
            address.phoneNumber = phoneNumber;
        if (isDefault !== undefined)
            address.isDefault = isDefault;
        await user.save();
        return res.status(200).json({
            message: "Address updated successfully",
            addresses: user.addresses,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res, next) => {
    try {
        const user = req.user;
        const { addressId } = req.params;
        if (!user) {
            return next(new root_1.default("Unauthorized", root_1.ErrorCodes.UNAUTHORIZED, 401));
        }
        const address = user.addresses.id(addressId);
        if (!address) {
            return next(new root_1.default("Address not found", root_1.ErrorCodes.ADDRESS_NOT_FOUND, 404));
        }
        address.deleteOne();
        await user.save();
        return res.status(200).json({
            message: "Address deleted successfully",
            addresses: user.addresses,
        });
    }
    catch (error) {
        return next(new root_1.default("Internal server error", root_1.ErrorCodes.INTERNAL_EXCEPTION, 500, error));
    }
};
exports.deleteAddress = deleteAddress;
