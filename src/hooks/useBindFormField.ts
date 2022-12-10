import { useEffect, useState } from 'react';
import { FormFields, Join, PathsToStringProps, UseForm } from '@/types/Form';

function useBindFormField<TFormValues extends FormFields = FormFields>({
  name,
  form,
}: {
  name: Join<PathsToStringProps<TFormValues>, '.'>;
  form: UseForm<TFormValues>;
}) {
  const [val, setVal] = useState<any>('');
  const { formFieldsSubscriptions, setValue, initFormField } = form;

  useEffect(() => {
    formFieldsSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, []);

  return {
    value: val,
    setFormFieldValue: (val: any) => setValue(name, val),
  };
}

export default useBindFormField;
