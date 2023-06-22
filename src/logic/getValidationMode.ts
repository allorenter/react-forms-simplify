import { ValidationMode } from '@/types/Form';

function getValidationMode(validationMode?: ValidationMode): ValidationMode {
  if (!validationMode) return 'onSubmit';

  return validationMode;
}

export default getValidationMode;
