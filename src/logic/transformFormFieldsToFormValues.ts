import { FormFields } from '@/types/Form';

function transformFormFieldsToFormValues(formFields: FormFields) {
  const result: Record<string, any> = {};

  for (const key of Object.keys(formFields)) {
    const value = formFields[key];
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current)) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      if (typeof current === 'object') {
        current[parts[parts.length - 1]] = value;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default transformFormFieldsToFormValues;
