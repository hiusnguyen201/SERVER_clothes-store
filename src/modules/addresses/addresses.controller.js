import HttpStatus from "http-status-codes";
import {
  ConflictException,
  NotFoundException,
  PreconditionFailedException,
} from "#src/core/exception/http-exception";
import {
  createAddressService,
  getAllAddressesService,
  getAddressByIdService,
  updateAddressByIdService,
  removeAddressByIdService,
  countAllAddressesService,
  deactivateIsDefaultByUserIdService,
} from "#src/modules/addresses/addresses.service";
import { calculatePagination } from "#src/utils/pagination.util";
import { validateAndGetAddress } from "#src/utils/address.util";

export const createAddressController = async (req, res) => {
  const userId = req?.user?._id || "674c2acaee49e3618bb6a9ff";
  const { provinceCode, districtCode, wardCode, address, isDefault } = req.body;

  const result = await validateAndGetAddress(provinceCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Err 422: ${JSON.stringify(result.errors)}`);
  }
  req.body.provinceName = result.data.province
  req.body.districtName = result.data.district
  req.body.wardName = result.data.ward

  if (isDefault) {
    await deactivateIsDefaultByUserIdService(userId);
  }

  const newAddress = await createAddressService({
    ...req.body,
    fullAddress: `${address}, ${result.data.ward}, ${result.data.district}, ${result.data.province}`,
    customer_id: userId
  });

  return res.json({
    statusCode: HttpStatus.CREATED,
    message: "Create address successfully",
    data: newAddress,
  });
};

export const getAllAddressesController = async (req, res) => {
  const userId = req?.user?._id || "674c2acaee49e3618bb6a9ff";

  let { limit = 10, page = 1 } = req.query;

  const filterOptions = {
    customer_id: userId
  };

  const totalCount = await countAllAddressesService(filterOptions);
  const metaData = calculatePagination(page, limit, totalCount);

  const addresses = await getAllAddressesService({
    filters: filterOptions,
    offset: metaData.offset,
    limit: metaData.limit,
  });

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all addresses successfully",
    data: { meta: metaData, list: addresses },
  });
};

export const getAddressByIdController = async (req, res) => {
  const { id } = req.params;

  const existAddress = await getAddressByIdService(id);
  if (!existAddress) {
    throw new NotFoundException("Address not found");
  }

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get one address successfully",
    data: existAddress,
  });
};

export const updateAddressByIdController = async (req, res) => {
  const userId = req?.user?._id || "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;
  const { provinceCode, districtCode, wardCode, address, isDefault } = req.body;

  const existAddress = await getAddressByIdService(id);
  if (!existAddress) {
    throw new NotFoundException("Address not found");
  }
  if (existAddress.customer_id != userId) {
    throw new ConflictException("UserId is invalid");
  }

  const result = await validateAndGetAddress(provinceCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Err 422: ${JSON.stringify(result.errors)}`);
  }
  req.body.provinceName = result.data.province
  req.body.districtName = result.data.district
  req.body.wardName = result.data.ward

  if (isDefault) {
    await deactivateIsDefaultByUserIdService(userId);
  }

  const updatedAddress = await updateAddressByIdService(id,
    {
      ...req.body,
      fullAddress: `${address}, ${result.data.ward}, ${result.data.district}, ${result.data.province}`,
    })

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Update address successfully",
    data: updatedAddress,
  });
};

export const removeAddressByIdController = async (req, res) => {
  const userId = req?.user?._id || "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existAddress = await getAddressByIdService(id);
  if (!existAddress) {
    throw new NotFoundException("Address not found");
  }
  console.log(existAddress.customer_id !== userId);
  
  if (existAddress.customer_id != userId) {
    throw new ConflictException("UserId is invalid");
  }

  const data = await removeAddressByIdService(id);
  return res.json({
    statusCode: HttpStatus.OK,
    message: "Remove address successfully",
    data,
  });
};
