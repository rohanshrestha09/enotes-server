import { Router } from "express";
import auth from "../middleware/auth";
import verifyChannel from "../middleware/verifyChannel";
import verifyNote from "../middleware/verifyNote";
import { createNote, notes, note } from "../controllers/note";

const router = Router();

router.post("/:id", auth, verifyChannel, createNote);

router.get("/", notes);

router.param("id", verifyNote);

router.get("/:id", note);

export default router;
