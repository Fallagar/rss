import mongoose, { Schema, model } from "mongoose";
import { IUserDocument } from "../types/types";

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Email is invalid",
            ],
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
    },
    {
        timestamps: true,
    }
);
const User = mongoose.models?.User || model<IUserDocument>("User", UserSchema);
export default User;
