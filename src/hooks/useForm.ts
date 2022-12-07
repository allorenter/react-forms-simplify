import { FormEvent, useCallback, useRef } from 'react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import { FormFields, Join, PathsToStringProps, SubmitFn, UseFormParams } from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import formatFormValues from '@/logic/formatFormValues';

// HAY QUE IMPLEMENTAR DOTNOTATION PARA get y setValue
function useForm<TFormFields extends FormFields = FormFields>(params?: UseFormParams) {
  const formFieldsSubscriptions =
    params?.formFieldsSubscriptions instanceof FormFieldsSubscriptions
      ? params?.formFieldsSubscriptions
      : new FormFieldsSubscriptions();

  const formFields = useRef<TFormFields>({} as TFormFields);

  const [getInputRef, setInputRef] = useDynamicRefs();

  const getValue = useCallback((name?: Join<PathsToStringProps<TFormFields>, '.'>) => {
    if (name === undefined) return formatFormValues(formFields.current);
    return formFields.current[name];
  }, []);

  const setValue = useCallback((name: Join<PathsToStringProps<TFormFields>, '.'>, value: any) => {
    if (name in formFields.current) {
      formFields.current[name] = value;
      formFieldsSubscriptions.publish(name as string, value);
    }
  }, []);

  // IMPORTANTE: hasta que no se ejecuta un onChange, no se setea en formFields
  const bindFormField = useCallback((name: Join<PathsToStringProps<TFormFields>, '.'>) => {
    formFieldsSubscriptions.initFormFieldSubscription(name as string);
    formFields.current[name] = '';

    const ref = setInputRef(name as string);

    const updateRefValue = (value: any) => {
      if (typeof ref?.current === 'object' && ref?.current !== null) {
        ref.current.value = value;
      }
    };

    formFieldsSubscriptions.subscribe(name as string, updateRefValue);

    const onChange = (e: any) => {
      const value = e.target.value;
      formFieldsSubscriptions.publish(name as string, value);
      formFields.current[name] = value;
    };

    return {
      name,
      onChange,
      ref,
    };
  }, []);

  const reset = useCallback((values: TFormFields) => {
    formFields.current = values;
    Object.entries(values).forEach((entry) => {
      const [name, value] = entry;
      formFieldsSubscriptions.publish(name, value);
    });
  }, []);

  const handleSubmit = useCallback(
    (submitFn: SubmitFn<TFormFields>) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return submitFn(formatFormValues(formFields.current) as TFormFields);
    },
    [],
  );

  return {
    bindFormField,
    handleSubmit,
    getValue,
    formFieldsSubscriptions,
    setValue,
    getInputRef,
    reset,
  };
}

export default useForm;
