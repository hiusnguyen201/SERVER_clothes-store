import { isValidObjectId } from "mongoose";
import { AddressModel } from "#src/modules/addresses/schemas/address.schema";

const SELECTED_FIELDS =
  "_id provinceCode districtCode wardCode provinceName districtName wardName fullAddress isDefault customer_id createdAt updatedAt";

/**
 * Create address
 * @param {*} data
 * @returns
 */
export async function createAddressService(data) {
  return AddressModel.create(data);
}

/**
 * Get all addresses
 * @param {*} query
 * @param {*} selectFields
 * @returns
 */
export async function getAllAddressesService({
  filters,
  offset = 0,
  limit = 10,
  selectFields = SELECTED_FIELDS,
}) {
  return AddressModel.find(filters)
    .skip(offset)
    .limit(limit)
    .select(selectFields)
    .sort({ isDefault: -1 });
}

/**
 * Count all addresses
 * @param {*} filters
 * @returns
 */
export async function countAllAddressesService(filters) {
  return AddressModel.countDocuments(filters);
}

/**
 * Get address by id
 * @param {*} id
 * @param {*} selectFields
 * @returns
 */
export async function getAddressByIdService(
  id,
  selectFields = SELECTED_FIELDS
) {
  if (!id) return null;
  const filter = {};

  if (isValidObjectId(id)) {
    filter._id = id;
  }
  return AddressModel.findOne(filter).select(selectFields);
}

/**
 * Update address by id
 * @param {*} id
 * @param {*} data
 * @returns
 */
export async function updateAddressByIdService(id, data) {
  return AddressModel.findByIdAndUpdate(id, data, {
    new: true,
  }).select(SELECTED_FIELDS);
}

/**
 * Remove address by id
 * @param {*} id
 * @returns
 */
export async function removeAddressByIdService(id) {
  return AddressModel.findByIdAndDelete(id).select(SELECTED_FIELDS);
}

/**
 * Deactivate isDefault all address by userId
 * @param {*} id
 * @returns
 */
export async function deactivateIsDefaultByUserIdService(id) {
  await AddressModel.updateMany(
    { customer_id: id },
    {
      isDefault: false,
    },
    { new: true }
  ).select(SELECTED_FIELDS);
  return;
}
