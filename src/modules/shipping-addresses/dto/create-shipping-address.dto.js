import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";

export const createShippingAddressDto = Joi.object({
  address: Joi.string()
    .required()
    .min(3)
    .max(100)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  provinceCode: Joi.string()
    .pattern(/^\d+$/)
    .required(),
  districtCode: Joi.string()
    .pattern(/^\d+$/)
    .required(),
  wardCode: Joi.string()
    .pattern(/^\d+$/)
    .required(),
});
