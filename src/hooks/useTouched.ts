import { FormFields, TouchedFormFields, UseForm } from '@/types/Form';
import { useEffect, useMemo, useState } from 'react';

function useTouched<TFormValues extends FormFields>({ form }: { form: UseForm<TFormValues> }) {
  const [touched, setTouched] = useState<TouchedFormFields>({});

  useEffect(() => {
    const unsubscribeFn = form.$instance.touchedSubscriptions.subscribe(
      (touch: TouchedFormFields) => {
        setTouched((prev) => ({ ...prev, ...touch }));
      },
    );
    return () => unsubscribeFn();
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

export default useTouched;
