import { BindOptions, Validation } from '@/index';

const VALIDATION_PROPERTY_NAMES = ['validationFn', 'required'];

function bindOptionsToValidation(bindOptions: BindOptions) {
  if (!bindOptions) {
    return null;
  }
  const validation: Validation = {};
  Object.entries(bindOptions).forEach((entry) => {
    const [key, value] = entry;
    if (VALIDATION_PROPERTY_NAMES.includes(key)) {
      validation[key as keyof Validation] = value;
    }
  });
  return Object.keys(validation).length === 0 ? null : validation;
}

export default bindOptionsToValidation;
