function transformFormValuesToFormFields(formValues: Record<string, any>) {
  const paths: Record<string, any> = {};

  for (const [key, value] of Object.entries(formValues)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedPaths = transformFormValuesToFormFields(value);
      for (const [nestedKey, nestedValue] of Object.entries(nestedPaths)) {
        paths[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      paths[key] = value;
    }
  }

  return paths;
}

export default transformFormValuesToFormFields;
