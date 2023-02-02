import { useEffect, useState } from 'react';
import { NamesValues, FormName, UseForm } from '@/types/Form';

function useValue<TFormValues extends NamesValues = NamesValues>({
  name,
  form,
}: {
  name: FormName<TFormValues>;
  form: UseForm<TFormValues>;
}) {
  const [value, setValue] = useState<any>();
  const { namesValuesSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = namesValuesSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
