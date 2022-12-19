import { TouchedFormFields, UseForm } from '@/types/Form';
import { useEffect, useMemo, useState } from 'react';

function useTouchedFormFields<TFormValues>({ form }: { form: UseForm<TFormValues> }) {
  const [touched, setTouched] = useState<TouchedFormFields>({});

  useEffect(() => {
    const unsuscribeFn = form.formFieldsTouchedSubcriptions.subscribe(
      (touch: TouchedFormFields) => {
        setTouched((prev) => ({ ...prev, ...touch }));
      },
    );
    return () => unsuscribeFn();
  }, []);

  const touchedArray = useMemo(() => {
    return Object.entries(touched)
      .filter((entry) => {
        const [, value] = entry;
        return value;
      })
      .map((entry) => {
        const [key] = entry;
        return key;
      });
  }, [touched]);

  return touchedArray;
}

export default useTouchedFormFields;
