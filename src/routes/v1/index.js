import express from "express";
const router = express.Router();

import usersRouter from "#src/routes/v1/users.route";
import authRouter from "#src/routes/v1/auth.route";
import rolesRouter from "#src/routes/v1/roles.route";
import permissionsRouter from "#src/routes/v1/permissions.route";
import customersRouter from "#src/routes/v1/customers.route";
import categoriesRouter from "#src/routes/v1/categories.route";
import vouchersRouter from "#src/routes/v1/vouchers.route";
import addressesRouter from "#src/routes/v1/addresses.route";

router.get("/ping", (req, res) => {
  res.send("Hello, world! PING");
});

router.use("/users", usersRouter);

router.use("/auth", authRouter);

router.use("/roles", rolesRouter);

router.use("/permissions", permissionsRouter);

router.use("/categories", categoriesRouter);

router.use("/customers", customersRouter);

router.use("/vouchers", vouchersRouter);

router.use("/addresses", addressesRouter);

export default router;
