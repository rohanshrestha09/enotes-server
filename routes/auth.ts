import { Router } from "express";
import auth from "../middleware/auth";
import verifyUser from "../middleware/verifyUser";
import { authHandler, updateProfile } from "../controllers/auth";
import { follow, unfollow } from "../controllers/auth/follow";
import { followers, following } from "../controllers/auth/followers";
import { channels } from "../controllers/auth/channels";
import { subscriptions } from "../controllers/auth/subscriptions";

const router = Router();

router.use(auth);

router.param("id", verifyUser);

router.get("/", authHandler);

router.patch("/", updateProfile);

router.post("/:id/follow", follow);

router.delete("/:id/follow", unfollow);

router.get("/followers", followers);

router.get("/following", following);

router.get("/channel", channels);

router.get("/subscription", subscriptions);

export default router;
