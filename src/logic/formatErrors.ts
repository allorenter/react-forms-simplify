import { FormErrors } from '@/types/Form';

function formatErrors(errors: FormErrors) {
  const objectEntries = Object.entries(errors).filter((entry) => {
    const [, error] = entry;
    return error !== undefined;
  });
  return Object.fromEntries(objectEntries);
}

export default formatErrors;
