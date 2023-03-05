import { useEffect, useState } from 'react';
import { Values, FormName, UseForm } from '@/types/Form';

function useValue<TFormValues extends Values = Values>({
  name,
  form,
}: {
  name: FormName<TFormValues>;
  form: UseForm<TFormValues>;
}) {
  const [value, setValue] = useState<any>();
  const { valuesSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = valuesSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
