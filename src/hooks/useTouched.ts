import { NamesValues, TouchedNamesValues, UseForm } from '@/types/Form';
import { useEffect, useMemo, useState } from 'react';

function useTouched<TFormValues extends NamesValues>({ form }: { form: UseForm<TFormValues> }) {
  const [touched, setTouched] = useState<TouchedNamesValues>({});

  useEffect(() => {
    const unsubscribeFn = form.$instance.touchedSubscriptions.subscribe(
      (touch: TouchedNamesValues) => {
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
