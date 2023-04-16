import { Router } from "express";
import auth from "./auth";
import user from "./user";
import channel from "./channel";
import note from "./note";
import { errorMiddleware } from "../utils/error";

const router = Router();

router.use("/auth", auth);

router.use("/user", user);

router.use("/channel", channel);

router.use("/note", note);

router.use(errorMiddleware);

export default router;
