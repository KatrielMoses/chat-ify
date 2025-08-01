import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: false,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            required: true,
            type: String,
            minLength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;