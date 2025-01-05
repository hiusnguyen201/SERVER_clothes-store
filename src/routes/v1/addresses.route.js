import express from "express";
const router = express.Router();

import {
  createAddressController,
  getAllAddressesController,
  getAddressByIdController,
  updateAddressByIdController,
  removeAddressByIdController,
} from "#src/modules/addresses/addresses.controller";
import { createAddressDto } from "#src/modules/addresses/dto/create-address.dto";
import { updateAddressDto } from "#src/modules/addresses/dto/update-address.dto";
import {
  validateSchema,
} from "#src/middlewares/validate-request.middleware";
import { isAuthorized } from "#src/middlewares/jwt-auth.middleware";

router
  .get("/get-addresses",
    // isAuthorized,
    getAllAddressesController)
  .get("/get-address-by-id/:id",
    // isAuthorized,
    getAddressByIdController)
  .post(
    "/create-address",
    // isAuthorized,
    validateSchema(createAddressDto),
    createAddressController
  )
  .patch(
    "/update-address-by-id/:id",
    // isAuthorized,
    validateSchema(updateAddressDto),
    updateAddressByIdController
  )
  .delete("/remove-address-by-id/:id",
    // isAuthorized,
    removeAddressByIdController);

export default router;