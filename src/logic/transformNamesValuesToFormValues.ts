import { NamesValues } from '@/types/Form';

function transformNamesValuesToFormValues(namesValues: NamesValues) {
  const result: Record<string, any> = {};

  for (const key of Object.keys(namesValues)) {
    const value = namesValues[key];
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

export default transformNamesValuesToFormValues;
