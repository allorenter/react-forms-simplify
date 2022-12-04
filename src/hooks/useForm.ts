import { FormEvent, useCallback, useRef } from 'react';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { FormValues, SubmitFn, UseFormParams } from '@/types/Form';
import useDynamicRefs from './useDynamicRef';

// HAY QUE IMPLEMENTAR DOTNOTATION PARA get y setValue
function useForm<TFormValues extends FormValues = FormValues>(params?: UseFormParams) {
  const formValuesSubscriptions =
    params?.formValuesSubscriptions instanceof FormValuesSubscriptions
      ? params?.formValuesSubscriptions
      : new FormValuesSubscriptions();

  const formValues = useRef<TFormValues>({} as TFormValues);

  const [getInputRef, setInputRef] = useDynamicRefs();

  const getValue = useCallback((name?: keyof TFormValues) => {
    if (name === undefined) return formValues.current;
    return formValues.current[name];
  }, []);

  const setValue = useCallback((name: keyof TFormValues, value: any) => {
    if (name in formValues.current) {
      formValues.current[name] = value;
      formValuesSubscriptions.publish(name as string, value);
    }
  }, []);

  // IMPORTANTE: hasta que no se ejecuta un onChange, no se setea en formValues
  const bindFormControl = useCallback((name: keyof TFormValues) => {
    formValuesSubscriptions.initFormValueSubscription(name as string);
    formValues.current[name] = '';

    const ref = setInputRef(name as string);

    const updateRefValue = (value: any) => {
      if (typeof ref?.current === 'object' && ref?.current !== null) {
        ref.current.value = value;
      }
    };

    formValuesSubscriptions.subscribe(name as string, updateRefValue);

    const onChange = (e: any) => {
      const value = e.target.value;
      formValuesSubscriptions.publish(name as string, value);
      formValues.current[name] = value;
    };

    return {
      name,
      onChange,
      ref,
    };
  }, []);

  const reset = useCallback((values: TFormValues) => {
    formValues.current = values;
    Object.entries(values).forEach((entry) => {
      const [name, value] = entry;
      formValuesSubscriptions.publish(name, value);
    });
  }, []);

  // const bindImageControl = () => {
  //   formValuesSubscriptions.addSubscription(name as string);

  //   // AQUI SE SUBE EL FILE
  //   const onChange = (e: any) => {
  //     const file = e.target.value;
  //     images.set(name, file);
  //   };

  //   return {
  //     value: formValues.current[name] || '',
  //     onChange,
  //   };
  // };

  const handleSubmit = useCallback(
    (submitFn: SubmitFn<TFormValues>) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitFn(formValues.current);
    },
    [],
  );

  return {
    bindFormControl,
    handleSubmit,
    getValue,
    formValuesSubscriptions,
    setValue,
    getInputRef,
    reset,
  };
}

export default useForm;
