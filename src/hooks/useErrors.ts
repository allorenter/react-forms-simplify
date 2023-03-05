import { Values, FormErrors, UseForm } from '@/types/Form';
import { useEffect, useState } from 'react';

function useErrors<TFormValues extends Values>({ form }: { form: UseForm<TFormValues> }) {
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const unsubscribeFn = form.$instance.errorsSubscriptions.subscribe((errors: FormErrors) => {
      setErrors(() => ({ ...errors }));
    });
    return () => unsubscribeFn();
  }, []);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    hasErrors,
    errors,
  };
}

export default useErrors;
