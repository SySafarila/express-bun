import Joi, {
  ValidationError,
  type AsyncValidationOptions,
  type ValidationOptions,
} from "joi";
import type {
  RoleDelete,
  RoleStore,
  RoleUpdate,
} from "../types/customRequests";

export const validateRoleRequest = async (
  values: RoleStore
): Promise<AsyncValidationOptions> => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
  });
  const options: ValidationOptions = {
    abortEarly: false,
  };
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

export const validateRoleUpdate = async (
  values: RoleUpdate
): Promise<AsyncValidationOptions> => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    id: Joi.number().required(),
  });
  const options: ValidationOptions = {
    abortEarly: false,
  };
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

export const validateRoleDelete = async (
  values: RoleDelete
): Promise<AsyncValidationOptions> => {
  const schema = Joi.object({
    id: Joi.number().required(),
  });
  const options: ValidationOptions = {
    abortEarly: false,
  };
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
