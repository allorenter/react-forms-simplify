import { useEffect, useState } from 'react';
import { Values, FormName, UseForm, FormValue } from '@/types/Form';

function useValue<
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>({ name, form }: { name: TName; form: UseForm<TFormValues> }): FormValue<TFormValues, TName> {
  const [value, setValue] = useState<any>();
  const { valuesSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = valuesSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
