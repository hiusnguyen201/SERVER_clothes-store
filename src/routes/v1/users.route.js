import express from "express";

import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserByIdController,
  removeUserByIdController,
} from "#src/modules/users/users.controller";
// import { createUserDto } from "#src/modules/users/dto/create-user.dto";
import {
  validateSchema,
  validateFile,
} from "#src/middlewares/validate-request.middleware";
import { UploadUtils } from "#src/utils/upload.util";
import { ALLOW_IMAGE_MIME_TYPES } from "#src/constants";

// every import stand above
const upload = UploadUtils.config(ALLOW_IMAGE_MIME_TYPES, 2);

const router = express.Router();

// Don't define router have no name like this
// like /create-user , /get-users, /get-user-by-id
// Tell another coder can read easily, clearly what API responsibility
router
  .get("/get-users", getAllUsersController)
  .get("/get-user-by-id", getUserByIdController)
  .post(
    "/create-user",
    // validateSchema(createUserDto),
    validateFile(upload.array("image")),
    createUserController,
  )
  .put("/update-user-by-id", updateUserByIdController)
  .delete("/remove-user-by-id", removeUserByIdController);

export default router;
