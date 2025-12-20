import mongoose from "mongoose";
import { MONGO_URI } from "../config/env";

export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1)
    }
}