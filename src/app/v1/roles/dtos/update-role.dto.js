import Joi from 'joi';
import { replaceMultiSpacesToSingleSpace } from '#utils/string.util';

export const updateRoleDto = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  description: Joi.string()
    .min(3)
    .max(255)
    .custom((value) => replaceMultiSpacesToSingleSpace(value)),
  isActive: Joi.boolean(),
  permissions: Joi.array().items(Joi.string()),
});
