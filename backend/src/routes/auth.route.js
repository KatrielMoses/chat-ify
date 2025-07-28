import express from "express";
import { login, signup, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { updateProfile, updateUsername, updateFullName, checkUsernameAvailability } from "../controllers/auth.controller.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.put("/update-username", protectRoute, updateUsername)

router.put("/update-fullname", protectRoute, updateFullName)

router.get("/check-username", protectRoute, checkUsernameAvailability)

router.get("/check", protectRoute, checkAuth)

export default router;