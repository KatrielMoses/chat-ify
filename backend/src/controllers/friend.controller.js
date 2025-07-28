import { FriendRequest, Friendship } from "../models/friend.model.js";
import User from "../models/user.model.js";

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.user._id;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Search by username or email
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                {
                    $or: [
                        { username: { $regex: query, $options: "i" } },
                        { email: { $regex: query, $options: "i" } }
                    ]
                }
            ]
        }).select("username email profilePic").limit(10);

        res.status(200).json(users);
    } catch (error) {
        console.log("Error in searchUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }

        if (senderId.toString() === receiverId) {
            return res.status(400).json({ message: "Cannot send friend request to yourself" });
        }

        // Check if users are already friends
        const existingFriendship = await Friendship.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId }
            ]
        });

        if (existingFriendship) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Check if friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const friendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId
        });

        await friendRequest.save();

        res.status(201).json({ message: "Friend request sent successfully" });
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendRequests = await FriendRequest.find({
            receiver: userId,
            status: "pending"
        }).populate("sender", "username email profilePic");

        res.status(200).json(friendRequests);
    } catch (error) {
        console.log("Error in getFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const respondToFriendRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: "accept" or "decline"
        const userId = req.user._id;

        if (!requestId || !action) {
            return res.status(400).json({ message: "Request ID and action are required" });
        }

        const friendRequest = await FriendRequest.findOne({
            _id: requestId,
            receiver: userId,
            status: "pending"
        });

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        friendRequest.status = action === "accept" ? "accepted" : "declined";
        await friendRequest.save();

        // If accepted, create friendship
        if (action === "accept") {
            const friendship = new Friendship({
                user1: friendRequest.sender,
                user2: friendRequest.receiver
            });
            await friendship.save();
        }

        res.status(200).json({ message: `Friend request ${action}ed successfully` });
    } catch (error) {
        console.log("Error in respondToFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendships = await Friendship.find({
            $or: [
                { user1: userId },
                { user2: userId }
            ]
        }).populate("user1 user2", "username email profilePic");

        // Extract friends (the other user in each friendship)
        const friends = friendships.map(friendship => {
            return friendship.user1._id.toString() === userId.toString()
                ? friendship.user2
                : friendship.user1;
        });

        res.status(200).json(friends);
    } catch (error) {
        console.log("Error in getFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}; 