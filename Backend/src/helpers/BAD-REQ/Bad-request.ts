import HttpException, { ErrorCodes } from "../ROOTS/root";
import { ZodError } from "zod";

export class BadRequestsException extends HttpException {
    constructor(
        message: string,
        errorCode: ErrorCodes,
        zodError?: ZodError
    ) {
        super(
            message,
            errorCode,
            422,
            zodError ? zodError.issues : null
        );
    }
}
