import { Router } from "express";
import verifyUser from "../middleware/verifyUser";
import { login, register, user } from "../controllers/user";

const router = Router();

router.param("id", verifyUser);

router.post("/register", register);

router.post("/login", login);

router.get("/:id", user);

export default router;
