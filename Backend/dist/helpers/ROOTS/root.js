"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
class HttpException extends Error {
    constructor(message, errorCode, statusCode, errors) {
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}
var ErrorCodes;
(function (ErrorCodes) {
    /* =========================
       USER / AUTH (1000–1999)
    ========================= */
    ErrorCodes[ErrorCodes["USER_NOT_FOUND"] = 1001] = "USER_NOT_FOUND";
    ErrorCodes[ErrorCodes["USER_ALREADY_EXISTS"] = 1002] = "USER_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["INCORRECT_PASSWORD"] = 1003] = "INCORRECT_PASSWORD";
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 1004] = "UNAUTHORIZED";
    ErrorCodes[ErrorCodes["FORBIDDEN"] = 1005] = "FORBIDDEN";
    /* =========================
       ADDRESS (1100–1199)
    ========================= */
    ErrorCodes[ErrorCodes["ADDRESS_NOT_FOUND"] = 1101] = "ADDRESS_NOT_FOUND";
    ErrorCodes[ErrorCodes["ADDRESS_DOES_NOT_BELONG"] = 1102] = "ADDRESS_DOES_NOT_BELONG";
    /* =========================
       VALIDATION / REQUEST (2000–2999)
    ========================= */
    ErrorCodes[ErrorCodes["UNPROCESSABLE_ENTITY"] = 2001] = "UNPROCESSABLE_ENTITY";
    ErrorCodes[ErrorCodes["INVALID_INPUT"] = 2002] = "INVALID_INPUT";
    ErrorCodes[ErrorCodes["MISSING_REQUIRED_FIELDS"] = 2003] = "MISSING_REQUIRED_FIELDS";
    ErrorCodes[ErrorCodes["INVALID_STATUS_VALUE"] = 2004] = "INVALID_STATUS_VALUE";
    ErrorCodes[ErrorCodes["FILE_UPLOAD_LIMIT_EXCEEDED"] = 2005] = "FILE_UPLOAD_LIMIT_EXCEEDED";
    /* =========================
       SERVER / INTERNAL (3000–3999)
    ========================= */
    ErrorCodes[ErrorCodes["INTERNAL_EXCEPTION"] = 3001] = "INTERNAL_EXCEPTION";
    ErrorCodes[ErrorCodes["DATABASE_ERROR"] = 3002] = "DATABASE_ERROR";
    ErrorCodes[ErrorCodes["THIRD_PARTY_SERVICE_ERROR"] = 3003] = "THIRD_PARTY_SERVICE_ERROR";
    /* =========================
       GENERIC / COMMON
    ========================= */
    ErrorCodes[ErrorCodes["NOT_FOUND"] = 4004] = "NOT_FOUND";
    /* =========================
       PRODUCT (5000–5099)
    ========================= */
    ErrorCodes[ErrorCodes["PRODUCT_NOT_FOUND"] = 5001] = "PRODUCT_NOT_FOUND";
    ErrorCodes[ErrorCodes["PRODUCT_ALREADY_EXISTS"] = 5002] = "PRODUCT_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["PRODUCT_OUT_OF_STOCK"] = 5003] = "PRODUCT_OUT_OF_STOCK";
    /* =========================
       ORDER (6000–6099)
    ========================= */
    ErrorCodes[ErrorCodes["ORDER_NOT_FOUND"] = 6001] = "ORDER_NOT_FOUND";
    ErrorCodes[ErrorCodes["ORDER_ALREADY_PAID"] = 6002] = "ORDER_ALREADY_PAID";
    ErrorCodes[ErrorCodes["ORDER_STATUS_INVALID"] = 6003] = "ORDER_STATUS_INVALID";
    ErrorCodes[ErrorCodes["ORDER_CANNOT_BE_UPDATED"] = 6004] = "ORDER_CANNOT_BE_UPDATED";
    /* =========================
       PAYMENT (7000–7099)
    ========================= */
    ErrorCodes[ErrorCodes["PAYMENT_FAILED"] = 7001] = "PAYMENT_FAILED";
    ErrorCodes[ErrorCodes["PAYMENT_NOT_FOUND"] = 7002] = "PAYMENT_NOT_FOUND";
    ErrorCodes[ErrorCodes["PAYMENT_ALREADY_PROCESSED"] = 7003] = "PAYMENT_ALREADY_PROCESSED";
    /* =========================
       FILE / MEDIA (8000–8099)
    ========================= */
    ErrorCodes[ErrorCodes["FILE_NOT_FOUND"] = 8001] = "FILE_NOT_FOUND";
    ErrorCodes[ErrorCodes["INVALID_FILE_TYPE"] = 8002] = "INVALID_FILE_TYPE";
    ErrorCodes[ErrorCodes["FILE_TOO_LARGE"] = 8003] = "FILE_TOO_LARGE";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
exports.default = HttpException;
