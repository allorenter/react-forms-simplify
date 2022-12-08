import { FormEvent, useCallback, useRef } from 'react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import { FormFields, Join, PathsToStringProps, SubmitFn, UseFormParams } from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import formatFormValues from '@/logic/formatFormValues';

function useForm<TFormValues extends FormFields = FormFields>(params?: UseFormParams) {
  const formFieldsSubscriptions =
    params?.formFieldsSubscriptions instanceof FormFieldsSubscriptions
      ? params?.formFieldsSubscriptions
      : new FormFieldsSubscriptions();

  const formFields = useRef<FormFields>({} as FormFields);

  const [, setFormFieldRef] = useDynamicRefs();

  const initFormField = useCallback((name: Join<PathsToStringProps<TFormValues>, '.'>) => {
    if (!formFields.current[name]) {
      formFields.current[name] = '';
    }
  }, []);

  const getValue = useCallback((name?: Join<PathsToStringProps<TFormValues>, '.'>) => {
    if (name === undefined) return formatFormValues(formFields.current);
    return formFields.current[name];
  }, []);

  const setValue = useCallback((name: Join<PathsToStringProps<TFormValues>, '.'>, value: any) => {
    if (name in formFields.current) {
      formFields.current[name] = value;
      formFieldsSubscriptions.publish(name as string, value);
    }
  }, []);

  const bindFormField = useCallback((name: Join<PathsToStringProps<TFormValues>, '.'>) => {
    formFieldsSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    const ref = setFormFieldRef(name as string);

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

  const reset = useCallback((values: TFormValues) => {
    formFields.current = values;
    Object.entries(values).forEach((entry) => {
      const [name, value] = entry;
      formFieldsSubscriptions.publish(name, value);
    });
  }, []);

  const handleSubmit = useCallback(
    (submitFn: SubmitFn<TFormValues>) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formatted = formatFormValues(formFields.current);
      return submitFn(formatted as TFormValues);
    },
    [],
  );

  return {
    bindFormField,
    handleSubmit,
    getValue,
    formFieldsSubscriptions,
    setValue,
    reset,
    initFormField,
  };
}

export default useForm;
