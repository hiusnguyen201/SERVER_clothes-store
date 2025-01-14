import HttpStatus from "http-status-codes";
import { NotFoundException } from "#src/core/exception/http-exception";
import {
  createShippingAddressService,
  getAllShippingAddressesService,
  getShippingAddressByIdService,
  updateShippingAddressByIdService,
  removeShippingAddressByIdService,
  countAllShippingAddressesService,
  setDefaultShippingAddressByIdService,
  unsetDefaultCurrentShippingAddressService,
} from "#src/modules/shipping-addresses/shipping-addresses.service";
import { calculatePagination } from "#src/utils/pagination.util";

export const createShippingAddressController = async (req) => {
  const { _id } = req.user;

  const totalCount = await countAllShippingAddressesService({
    customer: _id,
  });

  const newShippingAddress = await createShippingAddressService({
    ...req.body,
    ...(totalCount === 0 ? { isDefault: true } : {}),
    customer: _id,
  });

  return {
    statusCode: HttpStatus.CREATED,
    message: "Create shipping address successfully",
    data: newShippingAddress,
  };
};

export const getAllShippingAddressesController = async (req) => {
  const { _id } = req.user;
  let { limit = 10, page = 1 } = req.query;

  const filterOptions = {
    customer: _id,
  };

  const totalCount = await countAllShippingAddressesService(filterOptions);
  const metaData = calculatePagination(page, limit, totalCount);

  const shippingAddresses = await getAllShippingAddressesService({
    filters: filterOptions,
    offset: metaData.offset,
    limit: metaData.limit,
  });

  return {
    statusCode: HttpStatus.OK,
    message: "Get all shipping address successfully",
    data: { meta: metaData, list: shippingAddresses },
  };
};

export const getShippingAddressByIdController = async (req) => {
  const { id } = req.params;
  const existShippingAddress = await getShippingAddressByIdService(
    id,
    req.user._id
  );

  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  return {
    statusCode: HttpStatus.OK,
    message: "Get one shipping address successfully",
    data: existShippingAddress,
  };
};

export const updateShippingAddressByIdController = async (req) => {
  const { id } = req.params;
  const existShippingAddress = await getShippingAddressByIdService(
    id,
    req.user._id
  );

  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  const updatedShippingAddress = await updateShippingAddressByIdService(
    id,
    req.body
  );

  return {
    statusCode: HttpStatus.OK,
    message: "Update shipping address successfully",
    data: updatedShippingAddress,
  };
};

export const removeShippingAddressByIdController = async (req) => {
  const { id } = req.params;
  const existShippingAddress = await getShippingAddressByIdService(
    id,
    req.user._id
  );

  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  const data = await removeShippingAddressByIdService(id);
  return {
    statusCode: HttpStatus.OK,
    message: "Remove shipping address successfully",
    data,
  };
};

export const setDefaultShippingAddressByIdController = async (req) => {
  const { id } = req.params;
  const { _id: customerId } = req.user;
  const existShippingAddress = await getShippingAddressByIdService(
    id,
    customerId
  );

  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  await unsetDefaultCurrentShippingAddressService(customerId);
  await setDefaultShippingAddressByIdService(id, customerId);

  return {
    statusCode: HttpStatus.NO_CONTENT,
    message: "Set default shipping address successfully",
  };
};
