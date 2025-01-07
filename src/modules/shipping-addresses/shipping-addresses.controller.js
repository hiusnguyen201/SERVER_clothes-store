import HttpStatus from "http-status-codes";
import {
  ConflictException,
  NotFoundException,
  PreconditionFailedException,
} from "#src/core/exception/http-exception";
import {
  createShippingAddressService,
  getAllShippingAddressesService,
  getShippingAddressByIdService,
  updateShippingAddressByIdService,
  removeShippingAddressByIdService,
  countAllShippingAddressesService,
  findAndSetIsDefaultToFalseShippingAddressByCustomerId,
} from "#src/modules/shipping-addresses/shipping-addresses.service";
import { calculatePagination } from "#src/utils/pagination.util";
import { validateAndGetAddress } from "#src/utils/shipping-address.util";

export const createShippingAddressController = async (req, res) => {
  const userId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { provinceCode, districtCode, wardCode, isDefault } = req.body;

  const result = await validateAndGetAddress(provinceCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Error: ${JSON.stringify(result.errors)}`);
  }
  req.body.city = result.data.province
  req.body.district = result.data.district
  req.body.ward = result.data.ward

  if (isDefault) {
    await findAndSetIsDefaultToFalseShippingAddressByCustomerId(userId);
  }

  const newShippingAddress = await createShippingAddressService({
    ...req.body,
    customer: userId,
  });

  return res.json({
    statusCode: HttpStatus.CREATED,
    message: "Create shipping address successfully",
    data: newShippingAddress,
  });
};

export const getAllShippingAddressesController = async (req, res) => {
  const userId = req.user?._id || "674c2acaee49e3618bb6a9ff";

  let { limit = 10, page = 1 } = req.query;

  const filterOptions = {
    customer: userId
  };

  const totalCount = await countAllShippingAddressesService(filterOptions);
  const metaData = calculatePagination(page, limit, totalCount);

  const shippingAddresses = await getAllShippingAddressesService({
    filters: filterOptions,
    offset: metaData.offset,
    limit: metaData.limit,
  });

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all shipping address successfully",
    data: { meta: metaData, list: shippingAddresses },
  });
};

export const getShippingAddressByIdController = async (req, res) => {
  const userId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existShippingAddress = await getShippingAddressByIdService(id);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  if (existShippingAddress.customer != userId) {
    throw new ConflictException("UserId is invalid");
  }

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get one shipping address successfully",
    data: existShippingAddress,
  });
};

export const updateShippingAddressByIdController = async (req, res) => {
  const userId = req.user?._id || "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;
  const { provinceCode, districtCode, wardCode, isDefault } = req.body;

  const existShippingAddress = await getShippingAddressByIdService(id);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }
  if (existShippingAddress.customer != userId) {
    throw new ConflictException("UserId is invalid");
  }

  const result = await validateAndGetAddress(provinceCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Error: ${JSON.stringify(result.errors)}`);
  }
  req.body.city = result.data.province
  req.body.district = result.data.district
  req.body.ward = result.data.ward

  if (isDefault) {
    await findAndSetIsDefaultToFalseShippingAddressByCustomerId(userId);
  }

  const updatedShippingAddress = await updateShippingAddressByIdService(id,
    {
      ...req.body,
    })

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Update shipping address successfully",
    data: updatedShippingAddress,
  });
};

export const removeShippingAddressByIdController = async (req, res) => {
  const userId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existShippingAddress = await getShippingAddressByIdService(id);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  if (existShippingAddress.customer != userId) {
    throw new ConflictException("UserId is invalid");
  }

  const data = await removeShippingAddressByIdService(id);
  return res.json({
    statusCode: HttpStatus.OK,
    message: "Remove shipping address successfully",
    data,
  });
};
