import { Router } from "express";
import auth from "../middleware/auth";
import verifyChannel from "../middleware/verifyChannel";
import {
  channel,
  channels,
  createChannel,
  updateChannel,
} from "../controllers/channel";
import { subscribe, unsubscribe } from "../controllers/channel/subscribe";

const router = Router();

router.param("id", verifyChannel);

router.get("/:id", channel);

router.get("/", channels);

router.patch("/:id", updateChannel);

router.use("/*", auth);

router.post("/", createChannel);

router.post("/:id/subscribe", subscribe);

router.delete("/:id/subscribe", unsubscribe);

export default router;
