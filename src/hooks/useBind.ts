import { RefObject, useEffect, useState } from 'react';
import { BindValueOptions, Values, FormName, UseForm, FormValue } from '@/types/Form';

function useBind<
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>({
  name,
  form,
  options,
}: {
  name: TName;
  form: UseForm<TFormValues>;
  options?: BindValueOptions;
}) {
  const [val, setVal] = useState<FormValue<TFormValues, TName>>(
    '' as FormValue<TFormValues, TName>,
  );
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
    setValue: (val: FormValue<TFormValues, TName>) => {
      setValue(name, val);
    },
    ref: getInputRef(name) as RefObject<HTMLInputElement>,
  };
}

export default useBind;
