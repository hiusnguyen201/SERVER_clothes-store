import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";

export const updateShippingAddressDto = Joi.object({
  address: Joi.string()
    .min(3)
    .max(100)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  provinceCode: Joi.string()
    .pattern(/^\d+$/),
  districtCode: Joi.string()
    .pattern(/^\d+$/),
  wardCode: Joi.string()
    .pattern(/^\d+$/),
});
