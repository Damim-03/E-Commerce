import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const MONGO_URI = process.env.MONGO_URI;

export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

export const INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
