import Joi, {
  ValidationError,
  type AsyncValidationOptions,
  type ValidationOptions,
} from "joi";
import type { LoginRequest } from "../types/customRequests";

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  remember: Joi.boolean(),
});
const options: ValidationOptions = {
  abortEarly: false,
};

export const validateLogin = async (
  values: LoginRequest
): Promise<AsyncValidationOptions | ValidationError> => {
  try {
    const validate: AsyncValidationOptions = await schema.validateAsync(
      values,
      options
    );
    return validate;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(error.message, error.details, error._original);
    }
    throw new Error("Validation error");
  }
};
