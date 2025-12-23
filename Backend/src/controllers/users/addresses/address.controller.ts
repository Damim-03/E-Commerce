import HttpException, { ErrorCodes } from "../../../helpers/ROOTS/root";


export const addAddress = async(req: any, res: any, next: any) => {
    try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = (req as any).user;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    // 🔹 إذا العنوان الجديد default → ألغِ القديم
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
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
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
};

export const getAddresses = async(req: any, res: any, next: any) => {
    try {
    const user = (req as any).user;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    return res.status(200).json({
      addresses: user.addresses || [],
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
};

export const updateAddress = async(req: any, res: any, next: any) => {
    try {
    const user = (req as any).user;
    const { addressId } = req.params;

    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return next(
        new HttpException(
          "Address not found",
          ErrorCodes.ADDRESS_NOT_FOUND,
          404
        )
      );
    }

    // 🔹 لو العنوان الجديد default → ألغِ البقية
    if (isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    if (label !== undefined) address.label = label;
    if (fullName !== undefined) address.fullName = fullName;
    if (streetAddress !== undefined) address.streetAddress = streetAddress;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (phoneNumber !== undefined) address.phoneNumber = phoneNumber;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
};

export const deleteAddress = async(req: any, res: any, next: any) => {
    try {
    const user = (req as any).user;
    const { addressId } = req.params;

    if (!user) {
      return next(
        new HttpException(
          "Unauthorized",
          ErrorCodes.UNAUTHORIZED,
          401
        )
      );
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return next(
        new HttpException(
          "Address not found",
          ErrorCodes.ADDRESS_NOT_FOUND,
          404
        )
      );
    }

    
    address.deleteOne();

    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    return next(
      new HttpException(
        "Internal server error",
        ErrorCodes.INTERNAL_EXCEPTION,
        500,
        error
      )
    );
  }
}