import { FormErrors, Validation } from '@/types/Form';
import ErrorsSubscriptions from './ErrorsSubscriptions';

function validateFormField(
  validation: Validation | undefined,
  name: string,
  value: any,
  formFieldsErrors: FormErrors,
  formFieldsErrorsSubscriptions: ErrorsSubscriptions,
) {
  if (!validation) return;

  if (validation.required) {
    formFieldsErrors[name] =
      value === undefined || value === null || Number.isNaN(value) || value === ''
        ? {
            name,
            type: 'required',
          }
        : undefined;
  }

  formFieldsErrorsSubscriptions.publish(formFieldsErrors);
}

export default validateFormField;
