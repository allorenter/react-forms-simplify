import { useEffect, useState } from 'react';
import { FormFields, Join, PathsToStringProps, UseForm } from '@/types/Form';

function useBindFormField<TFormFields extends FormFields = FormFields>({
  name,
  form,
}: {
  name: Join<PathsToStringProps<TFormFields>, '.'>;
  form: UseForm<TFormFields>;
}) {
  const [val, setVal] = useState<any>();
  const { formFieldsSubscriptions, setValue } = form;

  useEffect(() => {
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, [formFieldsSubscriptions]);

  return {
    value: val,
    setFormField: (val: any) => setValue(name, val),
  };
}

export default useBindFormField;
