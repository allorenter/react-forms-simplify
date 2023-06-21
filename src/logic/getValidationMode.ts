import { ValidationMode } from '@/types/Form';

function getValidationMode(validationMode?: ValidationMode): ValidationMode {
  if (!validationMode) return 'onChange';

  return validationMode;
}

export default getValidationMode;
