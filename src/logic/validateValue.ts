import { FormErrors, Validation } from '@/types/Form';
import Subscriptions from './Subscriptions';
import formatErrors from './formatErrors';

function validateValue(
  validation: Validation | undefined,
  name: string,
  value: any,
  errors: FormErrors,
  errorsSubscriptions: Subscriptions,
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

  errorsSubscriptions.publish(formatErrors(errors));
}

export default validateValue;
