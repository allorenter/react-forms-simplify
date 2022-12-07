import { useEffect, useState } from 'react';
import { FormFields, Join, PathsToStringProps, UseForm } from '@/types/Form';

function useBindFormField<TFormValues extends FormFields = FormFields>({
  name,
  form,
}: {
  name: Join<PathsToStringProps<TFormValues>, '.'>;
  form: UseForm<TFormValues>;
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
