import { FormFieldsErrors } from '@/types/Form';

function formatFormFieldsErrors(formFieldsErrors: FormFieldsErrors) {
  const objectEntries = Object.entries(formFieldsErrors).filter((entry) => {
    const [, error] = entry;
    return error !== undefined;
  });
  return Object.fromEntries(objectEntries);
}

export default formatFormFieldsErrors;
