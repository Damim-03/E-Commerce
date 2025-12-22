import multer from "multer";
import path from "path";
import HttpException, { ErrorCodes } from "../../helpers/ROOTS/root";

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new HttpException(
        "Only image files are allowed (jpeg, jpg, png, webp)",
        ErrorCodes.INVALID_FILE_TYPE,
        422
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
