import Joi, { type ValidationOptions, ValidationError } from "joi";
import type { RegisterRequest } from "../types/customRequests";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  password_confirmation: Joi.ref("password"),
  full_name: Joi.string().min(3).max(255),
});
const options: ValidationOptions = {
  errors: {
    wrap: {
      label: "",
    },
  },
  abortEarly: false,
};

export const validateRegister = async (
  values: RegisterRequest
): Promise<Joi.AsyncValidationOptions | ValidationError> => {
  try {
    const validate = await schema.validateAsync(values, options);
    return validate;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(error.message, error.details, error._original);
    }
    throw new Error("Validation error");
  }
};
