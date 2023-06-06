import { useEffect, useState } from 'react';
import { Values, FormName, UseForm } from '@/types/Form';
import { FieldPath, FieldPathValue } from '@/types/Utils';

function useValue<
  TFormValues extends Values = Values,
  TName extends FieldPath<TFormValues> = FieldPath<TFormValues>,
>({ name, form }: { name: TName; form: UseForm<TFormValues> }): FieldPathValue<TFormValues, TName> {
  const [value, setValue] = useState<any>();
  const { valuesSubscriptions } = form.$instance;

  useEffect(() => {
    const unsubscribeFn = valuesSubscriptions.subscribe(name, setValue);
    return () => unsubscribeFn?.();
  }, []);

  return value;
}

export default useValue;
