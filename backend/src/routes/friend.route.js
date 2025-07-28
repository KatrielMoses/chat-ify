import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    searchUsers,
    sendFriendRequest,
    getFriendRequests,
    respondToFriendRequest,
    getFriends
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.post("/request", protectRoute, sendFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/respond", protectRoute, respondToFriendRequest);
router.get("/", protectRoute, getFriends);

export default router; 