import Joi from 'joi';

export const loginDto = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
