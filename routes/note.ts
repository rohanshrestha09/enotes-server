import { Router } from "express";
import auth from "../middleware/auth";
import verifyNote from "../middleware/verifyNote";
import { createNote, notes, note } from "../controllers/note";
import { like, likes, unlike } from "../controllers/note/like";

const router = Router();

router.post("/:channel", auth, createNote);

router.get("/", notes);

router.param("id", verifyNote);

router.get("/:id", note);

router.use("/*", auth);

router.get("/:id/like", likes);

router.post("/:id/like", like);

router.delete("/:id/like", unlike);

export default router;
