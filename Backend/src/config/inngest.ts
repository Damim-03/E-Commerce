import { Inngest } from "inngest";
import { connectDB } from "../db/db";
import { User } from "../models/users/user.model";
import { email } from "zod";
import e from "express";

export const inngest = new Inngest({ id: "ecommerce-app" })

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();

        const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}` || "User",
            imageUrl: profile_image_url || "",
            addresses: [],
            wishlist: []
        };

        await User.create(newUser);
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;
        await User.deleteOne({ clerkId: id });
    }
)

export const functions = [syncUser, deleteUserFromDB];