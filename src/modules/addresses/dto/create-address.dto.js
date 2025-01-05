import Joi from "joi";
import { replaceMultiSpacesToSingleSpace } from "#src/utils/string.util";

export const createAddressDto = Joi.object({
  address: Joi.string()
    .required()
    .min(3)
    .max(100)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  provinceCode: Joi.number()
    .required(),
  districtCode: Joi.number()
    .required(),
  wardCode: Joi.number()
    .required(),
  isDefault: Joi.boolean().required(),
});
