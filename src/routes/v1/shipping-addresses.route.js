import express from "express";
const router = express.Router();

import {
  createShippingAddressController,
  getAllShippingAddressesController,
  getShippingAddressByIdController,
  updateShippingAddressByIdController,
  removeShippingAddressByIdController,
} from "#src/modules/shipping-addresses/shipping-addresses.controller";
import { createShippingAddressDto } from "#src/modules/shipping-addresses/dto/create-shipping-address.dto";
import { updateShippingAddressDto } from "#src/modules/shipping-addresses/dto/update-shipping-address.dto";
import { validateSchema } from "#src/middlewares/validate-request.middleware";
import { isAuthorized } from "#src/middlewares/jwt-auth.middleware";

router
  .get("/get-shipping-addresses",
    // isAuthorized,
    getAllShippingAddressesController)
  .get("/get-shipping-address-by-id/:id",
    // isAuthorized,
    getShippingAddressByIdController)
  .post(
    "/create-shipping-address",
    // isAuthorized,
    validateSchema(createShippingAddressDto),
    createShippingAddressController
  )
  .patch(
    "/update-shipping-address-by-id/:id",
    // isAuthorized,
    validateSchema(updateShippingAddressDto),
    updateShippingAddressByIdController
  )
  .delete("/remove-shipping-address-by-id/:id",
    // isAuthorized,
    removeShippingAddressByIdController);

export default router;