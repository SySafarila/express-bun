import Joi, {
  ValidationError,
  type AsyncValidationOptions,
  type ValidationOptions,
} from "joi";
import type { UserSynchRoles } from "../types/customRequests";

const schema = Joi.object({
  user_id: Joi.number().min(1).required(),
  roles: Joi.array().items(Joi.number()).required(),
});
const options: ValidationOptions = {
  abortEarly: false,
};

export const validateSynchRoles = async (
  values: UserSynchRoles
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
