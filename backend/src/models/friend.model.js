import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        }
    },
    { timestamps: true }
);

const friendshipSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true }
);

// Ensure no duplicate friend requests
friendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Ensure no duplicate friendships
friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export const Friendship = mongoose.model("Friendship", friendshipSchema); 