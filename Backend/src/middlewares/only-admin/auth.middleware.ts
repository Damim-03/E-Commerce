import { requireAuth } from "@clerk/express";
import { User } from "../../models/users/user.model"
import { ADMIN_EMAIL } from "../../config/env";
import { errorHandler } from "../../helpers/ERRORS/error-handler";
import { UnauthorizedException } from "../../helpers/UNAUTHORIZED/unathorized";
import { NotFoundException } from "../../helpers/NOT-FOUND/not-found";
import HttpException, { ErrorCodes } from "../../helpers/ROOTS/root";

export const protectRoute = [
  requireAuth(),

  errorHandler(async (req: any, res: any, next: any) => {
    const clerkId = req.auth().userId;

    if (!clerkId) {
      throw new UnauthorizedException(
        "Unauthorized",
        ErrorCodes.UNAUTHORIZED
      );
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new NotFoundException(
        "User not found",
        ErrorCodes.USER_NOT_FOUND
      );
    }

    req.user = user;
    next();
  })
];


export const onlyAdmin = (req: any, res: any, next: any) => {

  if (!req.user) {
    throw new UnauthorizedException(
      "Unauthorized",
      ErrorCodes.UNAUTHORIZED
    );
  }

  if (req.user.email !== ADMIN_EMAIL) {
    throw new HttpException(
      "Forbidden. Admins only",
      ErrorCodes.UNAUTHORIZED,
      403
    );
  }

  next();
};