import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    filename: (req: any, file: any, cd: any) => {
        cd(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req: any, file: any, cd: any) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cd(null, true)
    } else {
        cd(new Error("Only images files are allowed (jpeg, jpg, png, webp)"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})