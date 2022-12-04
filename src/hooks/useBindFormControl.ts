import { useEffect, useState } from 'react';
import { UseForm } from '@/types/Form';

function useBindFormControl({ name, form }: { name: string; form: UseForm }) {
  const [val, setVal] = useState<any>();
  const { formValuesSubscriptions, setValue } = form;

  useEffect(() => {
    const unsubscribeFn = formValuesSubscriptions.subscribe(name, setVal);
    return () => unsubscribeFn?.();
  }, [formValuesSubscriptions]);

  return {
    value: val,
    setFormValue: (val: any) => setValue(name, val),
  };
}

export default useBindFormControl;
