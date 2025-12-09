import express from "express";
import { protect } from "../middlewares/authenticateToken.js";
import {getUserData,getFollowers,getFollowing,followUser,unfollowUser,getFollowNotifications,getUserByUsername,getAllUsers,updateProfileImage} from "../controllers/userData.js";

const router = express.Router();

router.get("/userdata", protect, getUserData);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);
router.get("/follownotifications", protect, getFollowNotifications);
router.get("/allusers", protect, getAllUsers);

router.post("/follow/:userIdToFollow", protect, followUser);
router.post("/unfollow/:userIdToUnfollow", protect, unfollowUser);
router.put("/update-profile-image", protect, updateProfileImage);

router.get("/:username", getUserByUsername);
 
export default router;
