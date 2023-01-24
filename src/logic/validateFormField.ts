import { FormFieldsErrors, Validation } from '@/types/Form';
import FormFieldsErrorsSubscriptions from './FormFieldsErrorsSubscriptions';

function validateFormField(
  validation: Validation | undefined,
  name: string,
  value: any,
  formFieldsErrors: FormFieldsErrors,
  formFieldsErrorsSubscriptions: FormFieldsErrorsSubscriptions,
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
