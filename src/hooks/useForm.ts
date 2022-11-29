import { FormEvent, useCallback, useRef } from 'react';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import { FormValues, SubmitFn } from '@/types/Form';

const formValuesSubscriptions = new FormValuesSubscriptions();

// HAY QUE IMPLEMENTAR DOTNOTATION PARA get y setValue
function useForm<TFormValues extends FormValues = FormValues>() {
  const formValues = useRef<TFormValues>({} as TFormValues);

  const getValue = useCallback((name?: keyof TFormValues) => {
    if (name === undefined) return formValues;
    return formValues.current[name];
  }, []);

  const setValue = useCallback((name: keyof TFormValues, value: any) => {
    formValues.current[name] = value;
  }, []);

  const bindControl = useCallback((name: keyof TFormValues) => {
    formValuesSubscriptions.addSubscription(name as string);

    const onChange = (e: any) => {
      const val = e.target.value;
      formValuesSubscriptions.publish(name as string, val);
      setValue(name, val);
    };

    return {
      value: formValues.current[name],
      onChange,
    };
  }, []);

  const handleSubmit = useCallback(
    (submitFn: SubmitFn<TFormValues>) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitFn(formValues.current);
    },
    [],
  );

  return {
    bindControl,
    handleSubmit,
    getValue,
    formValuesSubscriptions,
  };
}

export default useForm;
