import { Router } from "express";
import verifyUser from "../middleware/verifyUser";
import { login, register, user } from "../controllers/user";
import { channels } from "../controllers/user/channel";
import { notes } from "../controllers/user/note";
import { followers, following } from "../controllers/user/followers";

const router = Router();

router.param("id", verifyUser);

router.post("/register", register);

router.post("/login", login);

router.get("/:id", user);

router.get("/:id/followers", followers);

router.get("/:id/following", following);

router.get("/:id/channel", channels);

router.get("/:id/note", notes);

export default router;
