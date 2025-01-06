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
 * @param {*} id
 * @param {*} selectFields
 * @returns
 */
export async function getShippingAddressByIdService(
  id,
  selectFields = SELECTED_FIELDS
) {
  if (!id) return null;
  const filter = {};

  if (isValidObjectId(id)) {
    filter._id = id;
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
 * Find and set isDefault to false shipping address by customerId
 * @param {*} id
 * @returns
 */
export async function findAndSetIsDefaultToFalseShippingAddressByCustomerId(id) {
  await ShippingAddressModel.updateOne(
    {
      customer_id: id,
      isDefault: true,
    },
    {
      isDefault: false,
    },
    { new: true }
  ).select(SELECTED_FIELDS);
  return;
}
