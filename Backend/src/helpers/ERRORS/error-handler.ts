import { NextFunction, Request, Response } from "express";
import HttpException, { ErrorCodes } from "../ROOTS/root";
import { InternalException } from "./internal-exception";
import { ZodError } from "zod";
import { BadRequestsException } from "../BAD-REQ/Bad-request";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch (error: any) {
            let exception: HttpException;

            if (error instanceof HttpException) {
                // Already a known exception → pass through
                exception = error;

            } else if (error instanceof ZodError) {
                // Validation error → 422 Bad Request
                exception = new BadRequestsException(
                    "Unprocessable entity",
                    ErrorCodes.UNPROCESSABLE_ENTITY,
                    error
                );

            } else {
                // Unknown error → 500 Internal Server Error
                exception = new InternalException(
                    "Something went wrong!",
                    error,
                    ErrorCodes.INTERNAL_EXCEPTION
                );
            }

            next(exception);
        }
    };
};
