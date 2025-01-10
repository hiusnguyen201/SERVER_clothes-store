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
  activateDefaultShippingAddressIdService,
  deactivateDefaultShippingAddressIdService,
} from "#src/modules/shipping-addresses/shipping-addresses.service";
import { calculatePagination } from "#src/utils/pagination.util";
import { validateAndGetAddress } from "#src/modules/shipping-addresses/schemas/shipping-address.util";

export const createShippingAddressController = async (req, res) => {
  const customerId = req.user?._id ?? "674c2acaee49e3618bb6a9ff";
  const { cityCode, districtCode, wardCode } = req.body;

  const result = await validateAndGetAddress(cityCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Error: ${JSON.stringify(result.errors)}`);
  }
  req.body.city = result.data.city
  req.body.district = result.data.district
  req.body.ward = result.data.ward

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
  const { cityCode, districtCode, wardCode } = req.body;

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  const result = await validateAndGetAddress(cityCode, districtCode, wardCode);

  if (!result.isValid) {
    throw new PreconditionFailedException(`Error: ${JSON.stringify(result.errors)}`);
  }
  req.body.city = result.data.city
  req.body.district = result.data.district
  req.body.ward = result.data.ward

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

export const activateDefaultShippingAddressIdController = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user?._id || "674c2acaee49e3618bb6a9ff";

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  await activateDefaultShippingAddressIdService(id, customerId);

  return res.json({
    statusCode: HttpStatus.NO_CONTENT,
    message: "Activate default shipping address successfully",
  });
};

export const deactivateDefaultShippingAddressIdController = async (req, res) => {
  const customerId = req.user?._id || "674c2acaee49e3618bb6a9ff";
  const { id } = req.params;

  const existShippingAddress = await getShippingAddressByIdService(id, customerId);
  if (!existShippingAddress) {
    throw new NotFoundException("Shipping address not found");
  }

  const filterOptions = {
    customer: customerId,
    isDefault: true,
  };
  const totalCount = await countAllShippingAddressesService(filterOptions);
  
  if (totalCount === 1) {
    throw new ConflictException("Must have an address by default");
  }

  await deactivateDefaultShippingAddressIdService(id, customerId);

  return res.json({
    statusCode: HttpStatus.NO_CONTENT,
    message: "Deactivate default shipping address successfully",
  });
};

export const getAllCityController = async (req, res) => {
  const response = await fetch(process.env.URL_ADDRESS_API);
  if (!response.ok) {
    throw new NotFoundException("Shipping address not found");
  }
  const json = await response.json();

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all city successfully",
    data: json,
  });
}

export const getDistrictByCityController = async (req, res) => {
  const { id } = req.params;
  const response = await fetch(`${process.env.URL_ADDRESS_API}/p/${id}?depth=2`);
  if (!response.ok) {
    throw new NotFoundException("Shipping address not found");
  }
  const json = await response.json();

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all district successfully",
    data: json,
  });
}

export const getWardByCityController = async (req, res) => {
  const { id } = req.params;
  const response = await fetch(`${process.env.URL_ADDRESS_API}/d/${id}?depth=2`);
  if (!response.ok) {
    throw new NotFoundException("Shipping address not found");
  }
  const json = await response.json();

  return res.json({
    statusCode: HttpStatus.OK,
    message: "Get all ward successfully",
    data: json,
  });
}