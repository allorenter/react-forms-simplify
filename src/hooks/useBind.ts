import { RefObject, useEffect, useState } from 'react';
import { BindFormFieldOptions, NamesValues, FormName, UseForm } from '@/types/Form';

function useBind<TFormValues extends NamesValues = NamesValues>({
  name,
  form,
  options,
}: {
  name: FormName<TFormValues>;
  form: UseForm<TFormValues>;
  options?: BindFormFieldOptions;
}) {
  const [val, setVal] = useState<any>('');
  const {
    $instance: {
      namesValuesSubscriptions,
      initFormField,
      initFormFieldValidation,
      setFormFieldRef,
      getFormFieldRef,
    },
    setValue,
  } = form;

  useEffect(() => {
    namesValuesSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    initFormFieldValidation(name, options?.validation);
    setFormFieldRef(name);
    const unsubscribeFn = namesValuesSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, []);

  return {
    value: val,
    setValue: (val: any) => setValue(name, val),
    ref: getFormFieldRef(name) as RefObject<HTMLInputElement>,
  };
}

export default useBind;
