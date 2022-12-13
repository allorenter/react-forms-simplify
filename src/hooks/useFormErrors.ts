import { FormFieldsErrors, UseForm } from '@/types/Form';
import { useEffect, useState } from 'react';

function useFormErrors<T>({ form }: { form: UseForm<T> }) {
  const [errors, setErrors] = useState<FormFieldsErrors>({});

  useEffect(() => {
    const unsuscribeFn = form.formFieldsErrorsSubcriptions.subscribe((errors: FormFieldsErrors) => {
      setErrors(() => ({ ...errors }));
    });
    return () => unsuscribeFn();
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    hasErrors,
    errors,
  };
}

export default useFormErrors;
