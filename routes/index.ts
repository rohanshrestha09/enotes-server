import { Router } from "express";
import auth from "./auth";
import user from "./user";
import channel from "./channel";
import { errorMiddleware } from "../utils/error";

const router = Router();

router.use("/auth", auth);

router.use("/user", user);

router.use("/channel", channel);

router.use(errorMiddleware);

export default router;
