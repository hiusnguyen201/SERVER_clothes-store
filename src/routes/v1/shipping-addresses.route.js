import express from "express";
const router = express.Router();

import {
  createShippingAddressController,
  getAllShippingAddressesController,
  getShippingAddressByIdController,
  updateShippingAddressByIdController,
  removeShippingAddressByIdController,
  setDefaultShippingAddressByIdController,
} from "#src/modules/shipping-addresses/shipping-addresses.controller";
import { createShippingAddressDto } from "#src/modules/shipping-addresses/dto/create-shipping-address.dto";
import { updateShippingAddressDto } from "#src/modules/shipping-addresses/dto/update-shipping-address.dto";
import { validateSchema } from "#src/middlewares/validate-request.middleware";
import { isAuthorizedAndIsCustomer } from "#src/middlewares/jwt-auth.middleware";

router
  .get(
    "/get-shipping-addresses",
    isAuthorizedAndIsCustomer,
    getAllShippingAddressesController
  )
  .get(
    "/get-shipping-address-by-id/:id",
    isAuthorizedAndIsCustomer,
    getShippingAddressByIdController
  )
  .post(
    "/create-shipping-address",
    isAuthorizedAndIsCustomer,
    validateSchema(createShippingAddressDto),
    createShippingAddressController
  )
  .patch(
    "/update-shipping-address-by-id/:id",
    isAuthorizedAndIsCustomer,
    validateSchema(updateShippingAddressDto),
    updateShippingAddressByIdController
  )
  .delete(
    "/remove-shipping-address-by-id/:id",
    isAuthorizedAndIsCustomer,
    removeShippingAddressByIdController
  )
  .patch(
    "/set-default-by-id/:id",
    isAuthorizedAndIsCustomer,
    setDefaultShippingAddressByIdController
  );

export default router;
