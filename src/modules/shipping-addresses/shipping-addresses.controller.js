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
  setDefaultShippingAddressByIdService,
  unsetDefaultCurrentShippingAddressService,
} from "#src/modules/shipping-addresses/shipping-addresses.service";
import { calculatePagination } from "#src/utils/pagination.util";
import pkg from 'vietnam-provinces';
import { validateShippingAddress } from "#src/modules/shipping-addresses/dto/validate-shipping-address.dto";

const {
  getDistricts,
  getProvinces,
  getWards } = pkg;

export const createShippingAddressController = async (req, res) => {
  const customerId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { provinceCode, districtCode, wardCode } = req.body;

  const result = validateShippingAddress(provinceCode, districtCode, wardCode);
  if (!result) {
    throw new PreconditionFailedException("Invalid address");
  }

  req.body.city = result.province.name
  req.body.district = result.district.name
  req.body.ward = result.ward.name

  const filterOptions = {
    customer: customerId
  };

  const totalCount = await countAllShippingAddressesService(filterOptions);

  if (totalCount < 1) {
    req.body.isDefault = true;
  }

  const newShippingAddress = await createShippingAddressService({
    ...req.body,
    customer: customerId,
  });

  return res.json({
    statusCode: HttpStatus.CREATED,
    message: "Create shipping address successfully",
    data: newShippingAddress,
  });
};

export const getAllShippingAddressesController = async (req, res) => {
  const customerId = req.user?._id || "674c2acaee49e3618bb6a9ff";

  let { limit = 10, page = 1 } = req.query;

  const filterOptions = {
    customer: customerId
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
  const customerId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get one shipping address successfully",
    data: existShippingAddress,
  });
};

export const updateShippingAddressByIdController = async (req, res) => {
  const customerId = req.user?._id || "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;
  const { provinceCode, districtCode, wardCode } = req.body;

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  if (provinceCode || districtCode || wardCode) {
    const result = validateShippingAddress(provinceCode, districtCode, wardCode);
    if (!result) {
      throw new PreconditionFailedException("Invalid address");
    }

    req.body.city = provinceResult.data.name
    req.body.district = districtResult.data.name
    req.body.ward = wardResult.data.name
  }

  const updatedShippingAddress = await updateShippingAddressByIdService(id, req.body)

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Update shipping address successfully",
    data: updatedShippingAddress,
  });
};

export const removeShippingAddressByIdController = async (req, res) => {
  const customerId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  const data = await removeShippingAddressByIdService(id);
  return res.json({
    statusCode: HttpStatus.OK,
    message: "Remove shipping address successfully",
    data,
  });
};

export const setDefaultShippingAddressByIdController = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user?._id || "674c2acaee49e3618bb6a9ff";

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  await unsetDefaultCurrentShippingAddressService(customerId);
  await setDefaultShippingAddressByIdService(id, customerId);

  return res.json({
    statusCode: HttpStatus.NO_CONTENT,
    message: "Set default shipping address successfully",
  });
};

export const getAllProvincesController = async (req, res) => {
  const provinces = getProvinces();

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all provinces successfully",
    data: provinces,
  });
}

export const getAllDistrictsByProvincesController = async (req, res) => {
  const { provinceCode } = req.params;

  const districts = getDistricts(provinceCode);

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all districts successfully",
    data: districts,
  });
}

export const getAllWardsByDistrictController = async (req, res) => {
  const { districtCode } = req.params;

  const wards = getWards(districtCode);

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all wards successfully",
    data: wards,
  });
}