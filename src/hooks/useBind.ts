import { RefObject, useEffect, useState } from 'react';
import { BindFormFieldOptions, FormFields, FormName, UseForm } from '@/types/Form';

function useBind<TFormValues extends FormFields = FormFields>({
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
      formFieldsSubscriptions,
      initFormField,
      initFormFieldValidation,
      setFormFieldRef,
      getFormFieldRef,
    },
    setValue,
  } = form;

  useEffect(() => {
    formFieldsSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    initFormFieldValidation(name, options?.validation);
    setFormFieldRef(name);
    const unsubscribeFn = formFieldsSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, []);

  return {
    value: val,
    setValue: (val: any) => setValue(name, val),
    ref: getFormFieldRef(name) as RefObject<HTMLInputElement>,
  };
}

export default useBind;
