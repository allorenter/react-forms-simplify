import { FormErrors } from '@/types/Form';

function formatErrors(formFieldsErrors: FormErrors) {
  const objectEntries = Object.entries(formFieldsErrors).filter((entry) => {
    const [, error] = entry;
    return error !== undefined;
  });
  return Object.fromEntries(objectEntries);
}

export default formatErrors;
