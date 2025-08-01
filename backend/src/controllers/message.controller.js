import { getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { Friendship } from "../models/friend.model.js";
import { v2 as cloudinary } from "cloudinary";
import { io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
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

        res.status(200).json(friends)
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        //todo: realtime functionality left
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // send msg in real time
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
};