import { FormErrors, Validation } from '@/types/Form';
import ErrorsSubscriptions from './ErrorsSubscriptions';

function validateValue(
  validation: Validation | undefined,
  name: string,
  value: any,
  errors: FormErrors,
  errorsSubscriptions: ErrorsSubscriptions,
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

  errorsSubscriptions.publish(errors);
}

export default validateValue;
