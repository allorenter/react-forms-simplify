import { FormFieldsErrors, Validation } from '@/types/Form';
import FormFieldsErrorsSubscriptions from './FormFieldsErrorsSubcriptions';

function validateFormField(
  validation: Validation | undefined,
  name: string,
  value: any,
  formFieldsErrors: FormFieldsErrors,
  formFieldsErrorsSubcriptions: FormFieldsErrorsSubscriptions,
) {
  if (!validation) return;

  if (validation.required) {
    formFieldsErrors[name] =
      value === undefined || value === null || Number.isNaN(value) || value === ''
        ? {
            type: 'required',
          }
        : undefined;
  }

  formFieldsErrorsSubcriptions.publish(formFieldsErrors);
}

export default validateFormField;
