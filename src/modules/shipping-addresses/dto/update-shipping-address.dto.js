import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";

export const updateShippingAddressDto = Joi.object({
  address: Joi.string()
    .min(3)
    .max(100)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  street: Joi.string()
    .min(3)
    .max(50)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  provinceCode: Joi.number(),
  districtCode: Joi.number(),
  wardCode: Joi.number(),
  isDefault: Joi.boolean(),
});
