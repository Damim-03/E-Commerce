"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = exports.inngest = void 0;
const inngest_1 = require("inngest");
const db_1 = require("../db/db");
const user_model_1 = require("../models/users/user.model");
exports.inngest = new inngest_1.Inngest({ id: "ecommerce-app" });
const syncUser = exports.inngest.createFunction({ id: "sync-user" }, { event: "clerk/user.created" }, async ({ event }) => {
    await (0, db_1.connectDB)();
    const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
    const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}` || "User",
        imageUrl: profile_image_url || "",
        addresses: [],
        wishlist: []
    };
    await user_model_1.User.create(newUser);
});
const deleteUserFromDB = exports.inngest.createFunction({ id: "delete-user-from-db" }, { event: "clerk/user.deleted" }, async ({ event }) => {
    await (0, db_1.connectDB)();
    const { id } = event.data;
    await user_model_1.User.deleteOne({ clerkId: id });
});
exports.functions = [syncUser, deleteUserFromDB];
