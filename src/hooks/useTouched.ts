import { Values, TouchedValues, UseForm } from '@/types/Form';
import { useEffect, useMemo, useState } from 'react';

function useTouched<TFormValues extends Values>({ form }: { form: UseForm<TFormValues> }) {
  const [touched, setTouched] = useState<TouchedValues>({});

  useEffect(() => {
    const unsubscribeFn = form.$instance.touchedSubscriptions.subscribe((touch: TouchedValues) => {
      setTouched((prev) => ({ ...prev, ...touch }));
    });
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
