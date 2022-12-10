import { FormEvent, useCallback, useRef, useState } from 'react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import {
  FormFields,
  Join,
  PathsToStringProps,
  SubmitFn,
  TouchedFormFields,
  UseFormParams,
} from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import formatFormValues from '@/logic/formatFormValues';
import FormFieldsTouchedSubscriptions from '@/logic/FormFieldsTouchedSubscriptions';
import transformFormValuesToFormFields from '@/logic/transformFormValuesToFormFields';

function useForm<TFormValues extends FormFields = FormFields>(params?: UseFormParams) {
  const formFieldsSubscriptions =
    params?.formFieldsSubscriptions instanceof FormFieldsSubscriptions
      ? params?.formFieldsSubscriptions
      : new FormFieldsSubscriptions();

  const formFieldsTouchedSubcriptions =
    params?.formFieldsTouchedSubscriptions instanceof FormFieldsTouchedSubscriptions
      ? params?.formFieldsTouchedSubscriptions
      : new FormFieldsTouchedSubscriptions();

  const formFields = useRef<FormFields>({} as FormFields);

  const [, setFormFieldRef] = useDynamicRefs();

  const touchedFormFields = useRef<TouchedFormFields>({});

  // const [formFieldsErrors, setFormFieldErrors] = useState<FormFields>({} as FormFields);

  const initFormField = useCallback((name: Join<PathsToStringProps<TFormValues>, '.'>) => {
    if (!formFields.current[name]) {
      formFields.current[name] = '';
      touchedFormFields.current[name] = false;
    }
  }, []);

  const touchFormField = useCallback(
    (name: Join<PathsToStringProps<TFormValues>, '.'>, touch = true) => {
      // solo lo ejecuto en caso de querer cambiar su valor
      if (touchedFormFields.current[name] !== touch) {
        touchedFormFields.current[name] = touch;
        formFieldsTouchedSubcriptions.publish(touchedFormFields.current);
      }
    },
    [],
  );

  const getValue = useCallback((name?: Join<PathsToStringProps<TFormValues>, '.'>) => {
    if (name === undefined) return formatFormValues(formFields.current);
    return formFields.current[name];
  }, []);

  const setValue = useCallback((name: Join<PathsToStringProps<TFormValues>, '.'>, value: any) => {
    if (name in formFields.current) {
      formFields.current[name] = value;
      formFieldsSubscriptions.publish(name as string, value);
      touchFormField(name);
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
      touchFormField(name);
    };

    return {
      name,
      onChange,
      ref,
    };
  }, []);

  const reset = useCallback((values: TFormValues) => {
    const newFormFields = transformFormValuesToFormFields(values);
    formFields.current = newFormFields;
    Object.entries(newFormFields).forEach((entry) => {
      const [name, value] = entry;
      formFieldsSubscriptions.publish(name, value);
      touchFormField(name as Join<PathsToStringProps<TFormValues>, '.'>, false);
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
    formFieldsTouchedSubcriptions,
  };
}

export default useForm;
