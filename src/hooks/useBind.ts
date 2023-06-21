import { RefObject, useEffect, useMemo, useState } from 'react';
import { Values, FormName, UseForm, FormValue, UseBindOptions } from '@/types/Form';
import _bind from '@/logic/bind';
import _initValueValidation from '@/logic/initValueValidation';
import _initValue from '@/logic/initValue';

function useBind<
  Element extends HTMLElement = HTMLInputElement,
  TFormValues extends Values = Values,
  TName extends FormName<TFormValues> = FormName<TFormValues>,
>({ name, form, options }: { name: TName; form: UseForm<TFormValues>; options?: UseBindOptions }) {
  const {
    initialValues,
    errorsSubscriptions,
    initializedValues,
    setInputRef,
    touchedValues,
    values,
    valuesSubscriptions,
    valuesValidations,
  } = form.$instance;
  const { setValue } = form;

  const [val, setVal] = useState<FormValue<TFormValues, TName>>(initialValues?.[name] || '');
  const [error, setError] = useState<boolean | undefined>();

  useEffect(() => {
    errorsSubscriptions.initSubscription(name);
    valuesSubscriptions.initSubscription(name);
    _initValue({
      initializedValues,
      initialValues,
      name,
      touchedValues,
      values,
    });
    _initValueValidation({
      name,
      valuesValidations,
      bindOptions: options,
    });
    const unsubscribeFnValues = valuesSubscriptions.subscribe(name as string, setVal);
    const unsubscribeFnErrors = errorsSubscriptions.subscribe(name as string, (invalid) => {
      setError(invalid);
    });
    return () => {
      unsubscribeFnValues?.();
      unsubscribeFnErrors?.();
    };
  }, []);

  const ref = useMemo(() => {
    const r = setInputRef(name) as RefObject<Element>;
    if (r.current) r.current.ariaInvalid = error ? 'true' : 'undefined';
    return r;
  }, [setInputRef, error]);

  return {
    value: val,
    setValue: (val: FormValue<TFormValues, TName>) => {
      setValue(name, val);
    },
    ref,
    error,
  };
}

export default useBind;
