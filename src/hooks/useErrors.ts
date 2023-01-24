import { FormFieldsErrors, UseForm } from '@/types/Form';
import { useEffect, useState } from 'react';

function useErrors<TFormValues>({ form }: { form: UseForm<TFormValues> }) {
  const [errors, setErrors] = useState<FormFieldsErrors>({});

  useEffect(() => {
    const unsubscribeFn = form.formFieldsErrorsSubscriptions.subscribe(
      (errors: FormFieldsErrors) => {
        setErrors(() => ({ ...errors }));
      },
    );
    return () => unsubscribeFn();
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    hasErrors,
    errors,
  };
}

export default useErrors;
