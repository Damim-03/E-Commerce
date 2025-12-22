class HttpException extends Error {
    errorCode: number;
    statusCode: number;
    errors?: any;

    constructor(message: string, errorCode: ErrorCodes, statusCode: number, errors?: any) {
        super(message);

        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors;

        Object.setPrototypeOf(this, HttpException.prototype);
    }
}

export enum ErrorCodes {
  /* =========================
     USER / AUTH (1000–1999)
  ========================= */
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNAUTHORIZED = 1004,
  FORBIDDEN = 1005,

  /* =========================
     ADDRESS (1100–1199)
  ========================= */
  ADDRESS_NOT_FOUND = 1101,
  ADDRESS_DOES_NOT_BELONG = 1102,

  /* =========================
     VALIDATION / REQUEST (2000–2999)
  ========================= */
  UNPROCESSABLE_ENTITY = 2001,
  INVALID_INPUT = 2002,
  MISSING_REQUIRED_FIELDS = 2003,
  INVALID_STATUS_VALUE = 2004,
  FILE_UPLOAD_LIMIT_EXCEEDED = 2005,

  /* =========================
     SERVER / INTERNAL (3000–3999)
  ========================= */
  INTERNAL_EXCEPTION = 3001,
  DATABASE_ERROR = 3002,
  THIRD_PARTY_SERVICE_ERROR = 3003, // Cloudinary, Stripe, etc.

  /* =========================
     PRODUCT (5000–5099)
  ========================= */
  PRODUCT_NOT_FOUND = 5001,
  PRODUCT_ALREADY_EXISTS = 5002,
  PRODUCT_OUT_OF_STOCK = 5003,

  /* =========================
     ORDER (6000–6099)
  ========================= */
  ORDER_NOT_FOUND = 6001,
  ORDER_ALREADY_PAID = 6002,
  ORDER_STATUS_INVALID = 6003,
  ORDER_CANNOT_BE_UPDATED = 6004,

  /* =========================
     PAYMENT (7000–7099)
  ========================= */
  PAYMENT_FAILED = 7001,
  PAYMENT_NOT_FOUND = 7002,
  PAYMENT_ALREADY_PROCESSED = 7003,

  /* =========================
     FILE / MEDIA (8000–8099)
  ========================= */
  FILE_NOT_FOUND = 8001,
  INVALID_FILE_TYPE = 8002,
  FILE_TOO_LARGE = 8003,
}

export default HttpException;
