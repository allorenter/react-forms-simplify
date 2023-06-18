import { RefObject, useEffect, useState } from 'react';
import { Values, FormName, UseForm, FormValue, UseBindOptions } from '@/types/Form';

function useBind<
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>({ name, form, options }: { name: TName; form: UseForm<TFormValues>; options?: UseBindOptions }) {
  const [val, setVal] = useState<any>(form?.$instance?.initialValues?.[name] || '');
  const {
    $instance: { valuesSubscriptions, initValue, initValueValidation, setInputRef, getInputRef },
    setValue,
  } = form;

  useEffect(() => {
    valuesSubscriptions.initSubscription(name as string);
    initValue(name);
    initValueValidation(name, options);
    setInputRef(name);
    const unsubscribeFn = valuesSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, []);

  return {
    value: val,
    setValue: (val: FormValue<TFormValues, TName>) => {
      setValue(name, val);
    },
    ref: getInputRef(name) as RefObject<HTMLInputElement>,
  };
}

export default useBind;
