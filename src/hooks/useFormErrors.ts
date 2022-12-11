import { FormFieldsErrors, UseForm } from '@/types/Form';
import { useEffect, useState } from 'react';

function useFormErrors<T>({ form }: { form: UseForm<T> }) {
  const [errors, setErrors] = useState<FormFieldsErrors>({});

  useEffect(() => {
    const unsuscribeFn = form.formFieldsErrorsSubcriptions.subscribe((errors: FormFieldsErrors) => {
      setErrors((prev) => ({ ...prev, ...errors }));
    });
    return () => unsuscribeFn();
  }, []);

  console.log('errors', errors);

  return errors;
}

export default useFormErrors;
