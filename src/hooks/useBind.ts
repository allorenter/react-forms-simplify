import { RefObject, useEffect, useState } from 'react';
import { BindValueOptions, Values, FormName, UseForm } from '@/types/Form';

function useBind<TFormValues extends Values = Values>({
  name,
  form,
  options,
}: {
  name: FormName<TFormValues>;
  form: UseForm<TFormValues>;
  options?: BindValueOptions;
}) {
  const [val, setVal] = useState<any>('');
  const {
    $instance: { valuesSubscriptions, initValue, initValueValidation, setInputRef, getInputRef },
    setValue,
  } = form;

  useEffect(() => {
    valuesSubscriptions.initValueSubscription(name as string);
    initValue(name);
    initValueValidation(name, options?.validation);
    setInputRef(name);
    const unsubscribeFn = valuesSubscriptions.subscribe(name as string, setVal);
    return () => unsubscribeFn?.();
  }, []);

  return {
    value: val,
    setValue: (val: any) => setValue(name, val),
    ref: getInputRef(name) as RefObject<HTMLInputElement>,
  };
}

export default useBind;
