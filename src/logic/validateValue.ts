import { FormErrors, Validation } from '@/types/Form';
import formatErrors from './formatErrors';
import FormNameSubscriptions from './FormNameSubscriptions';

function validateValue(
  validation: Validation | undefined,
  name: string,
  value: any,
  errors: FormErrors,
  errorsSubscriptions: FormNameSubscriptions,
) {
  if (!validation) return;

  if (validation.required) {
    errors[name] =
      value === undefined || value === null || Number.isNaN(value) || value === ''
        ? {
            name,
            type: 'required',
          }
        : undefined;
  }

  if (typeof validation.validateFunction === 'function') {
    const validateResult = validation.validateFunction(value);
    if (validateResult) {
      errors[name] = {
        name,
        type: 'validateFunction',
        message: typeof validateResult === 'string' ? validateResult : undefined,
      };
    }
  }

  const formatted = formatErrors(errors);
  errorsSubscriptions.publish(name, formatted?.[name]);
}

export default validateValue;
