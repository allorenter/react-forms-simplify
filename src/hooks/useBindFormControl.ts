import { useEffect, useState } from 'react';
import { FormValues, UseForm } from '@/types/Form';

function useBindFormControl<TFormValues extends FormValues = FormValues>({
  name,
  form,
}: {
  name: keyof TFormValues;
  form: UseForm<TFormValues>;
}) {
  const [val, setVal] = useState<any>();
  const { formValuesSubscriptions, setValue } = form;

  useEffect(() => {
    const unsubscribeFn = formValuesSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, [formValuesSubscriptions]);

  return {
    value: val,
    setFormValue: (val: any) => setValue(name, val),
  };
}

export default useBindFormControl;
