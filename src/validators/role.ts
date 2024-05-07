import Joi, {
  ValidationError,
  type AsyncValidationOptions,
  type ValidationOptions,
} from "joi";
import type { RoleStore } from "../types/customRequests";

const schema = Joi.object({
  name: Joi.string().min(5).required(),
});
const options: ValidationOptions = {
  abortEarly: false,
};

export const validateRoleRequest = async (
  values: RoleStore
): Promise<AsyncValidationOptions> => {
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
