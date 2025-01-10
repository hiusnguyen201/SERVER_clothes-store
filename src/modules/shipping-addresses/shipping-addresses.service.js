import { isValidObjectId } from "mongoose";
import { ShippingAddressModel } from "#src/modules/shipping-addresses/schemas/shipping-address.schema";

const SELECTED_FIELDS =
  "_id address street ward district city isDefault customer createdAt updatedAt";

/**
 * Create shipping address
 * @param {*} data
 * @returns
 */
export async function createShippingAddressService(data) {
  return ShippingAddressModel.create(data);
}

/**
 * Get all shipping address
 * @param {*} query
 * @param {*} selectFields
 * @returns
 */
export async function getAllShippingAddressesService({
  filters,
  offset = 0,
  limit = 10,
  selectFields = SELECTED_FIELDS,
}) {
  return ShippingAddressModel.find(filters)
    .skip(offset)
    .limit(limit)
    .select(selectFields)
    .sort({ isDefault: -1 });
}

/**
 * Count all shipping addresses
 * @param {*} filters
 * @returns
 */
export async function countAllShippingAddressesService(filters) {
  return ShippingAddressModel.countDocuments(filters);
}

/**
 * Get address by id
 * @param {*} addressId
 * @param {*} customerId
 * @param {*} selectFields
 * @returns
 */
export async function getShippingAddressByIdService(
  addressId,
  customerId,
  selectFields = SELECTED_FIELDS
) {
  if (!addressId) return null;
  const filter = {};

  if (isValidObjectId(addressId)) {
    filter._id = addressId;
  }

  if (isValidObjectId(customerId)) {
    filter.customer = customerId;
  }

  return ShippingAddressModel.findOne(filter).select(selectFields);
}

/**
 * Update shipping address by id
 * @param {*} id
 * @param {*} data
 * @returns
 */
export async function updateShippingAddressByIdService(id, data) {
  return ShippingAddressModel.findByIdAndUpdate(id, data, {
    new: true,
  }).select(SELECTED_FIELDS);
}

/**
 * Remove shipping address by id
 * @param {*} id
 * @returns
 */
export async function removeShippingAddressByIdService(id) {
  return ShippingAddressModel.findByIdAndDelete(id).select(SELECTED_FIELDS);
}

/**
 * Active default shipping address
 * @param {*} addressId
 * @param {*} customerId
 * @returns
 */
export async function activateDefaultShippingAddressIdService(addressId, customerId) {

  await ShippingAddressModel.updateOne(
    {
      customer: customerId,
      isDefault: true,
    },
    {
      isDefault: false,
    },
    { new: true }
  ).select(SELECTED_FIELDS);

  await ShippingAddressModel.updateOne(
    {
      _id: addressId,
      customer: customerId,
    },
    {
      isDefault: true,
    },
    { new: true }
  ).select(SELECTED_FIELDS);
  return;
}

/**
 * Deactive default shipping address
 * @param {*} addressId
 * @param {*} customerId
 * @returns
 */

export async function deactivateDefaultShippingAddressIdService(addressId, customerId) {
  await ShippingAddressModel.updateOne(
    {
      _id: addressId,
      customer: customerId,
    },
    {
      isDefault: false,
    },
    { new: true }
  ).select(SELECTED_FIELDS);

  return;
}