import { Values } from '@/types/Form';

function transformValuesToFormValues(values: Values) {
  const result: Record<string, any> = {};

  for (const key of Object.keys(values)) {
    const value = values[key];
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

export default transformValuesToFormValues;
