import express from "express";
const router = express.Router();

import usersRouter from "#src/routes/v1/users.route";
import authRouter from "#src/routes/v1/auth.route";

router.route("/users", usersRouter);
router.route("/auth", authRouter);

export default router;
