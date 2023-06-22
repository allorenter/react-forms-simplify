import { RefObject, useCallback, useRef, useState } from 'react';
import {
  BindOptions,
  Values,
  FormErrors,
  ValidationValues,
  FormName,
  SubmitFn,
  TouchedValues,
  UseForm,
  UseFormParams,
  TypeValues,
  FormValue,
  DefaultValues,
  InitializedValues,
  BindUnsubscribeFns,
  ValidationMode,
} from '@/types/Form';
import useInputElementRefs from './useInputElementRefs';
import formatErrors from '@/logic/formatErrors';
import { createCheckboxOrRadioName } from '@/logic/checkboxOrRadioName';
import createValuesSubscriptions from '@/logic/createValuesSubscriptions';
import createTouchedSubscriptions from '@/logic/createTouchedSubscriptions';
import createErrorsSubscriptions from '@/logic/createErrorsSubscriptions';
import getInitialValues from '@/logic/getInitialValues';
import _initValueValidation from '@/logic/initValueValidation';
import _initValue from '@/logic/initValue';
import _initValueType from '@/logic/initValueType';
import _touchValue from '@/logic/touchValue';
import _getValue from '@/logic/getValue';
import _setValue from '@/logic/setValue';
import _bind from '@/logic/bind';
import _bindCheckbox from '@/logic/bindCheckbox';
import _bindRadio from '@/logic/bindRadio';
import _bindNumber from '@/logic/bindNumber';
import _reset from '@/logic/reset';
import _submit from '@/logic/submit';
import getValidationMode from '@/logic/getValidationMode';

function useForm<TFormValues extends Values = Values>(
  params?: UseFormParams<TFormValues>,
): UseForm<TFormValues> {
  const valuesSubscriptions = createValuesSubscriptions(params?.$instance?.valuesSubscriptions);
  const touchedSubscriptions = createTouchedSubscriptions(params?.$instance?.touchedSubscriptions);
  const errorsSubscriptions = createErrorsSubscriptions(params?.$instance?.errorsSubscriptions);

  const initialValues = useRef(getInitialValues(params?.defaultValues));
  const initializedValues = useRef<InitializedValues>({});
  const values = useRef<Values>({});
  const touchedValues = useRef<TouchedValues>({});
  const errors = useRef<FormErrors>({});
  const valuesValidations = useRef<ValidationValues>({});
  const valuesTypes = useRef<TypeValues>({});
  const [getInputRef, setInputRef] = useInputElementRefs<HTMLInputElement>();
  const bindUnsubscribeFns = useRef<BindUnsubscribeFns>({});
  const validationMode = useRef<{ mode: ValidationMode }>({
    mode: getValidationMode(params?.validationMode),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getValue = useCallback((name?: FormName<TFormValues>) => {
    return _getValue({ name, values: values.current });
  }, []);

  const setValue = useCallback(
    <TName extends FormName<TFormValues>>(name: TName, value: FormValue<TFormValues, TName>) => {
      return _setValue<TFormValues>({
        name,
        value: value as any,
        errors: errors.current,
        errorsSubscriptions,
        touchedSubscriptions,
        touchedValues: touchedValues.current,
        values: values.current,
        valuesSubscriptions,
        valuesValidations: valuesValidations.current,
        validationMode: validationMode.current,
      });
    },
    [],
  );

  const bind = useCallback((name: FormName<TFormValues>, options?: BindOptions) => {
    const ref = setInputRef(name as string) as RefObject<HTMLInputElement>;
    const bindResult = _bind<TFormValues>({
      name,
      options,
      errors: errors.current,
      errorsSubscriptions,
      touchedSubscriptions,
      touchedValues: touchedValues.current,
      values: values.current,
      valuesSubscriptions,
      valuesValidations: valuesValidations.current,
      initializedValues: initializedValues.current,
      initialValues: initialValues.current,
      valuesTypes: valuesTypes.current,
      updateInputValue: (value: any) => {
        if (typeof ref?.current === 'object' && ref?.current !== null) ref.current.value = value;
      },
      bindUnsubscribeFns: bindUnsubscribeFns.current,
      updateInputInvalid: (invalid) => {
        if (typeof ref?.current === 'object' && ref?.current !== null)
          ref.current.ariaInvalid = invalid ? 'true' : 'undefined';
      },
      validationMode: validationMode.current,
    });
    return { ...bindResult, ref };
  }, []);

  const bindCheckbox = useCallback(
    (name: FormName<TFormValues>, value: string, options?: BindOptions) => {
      const ref = setInputRef(name as string) as RefObject<HTMLInputElement>;
      const bindResult = _bindCheckbox<TFormValues>({
        name,
        options,
        errors: errors.current,
        errorsSubscriptions,
        touchedSubscriptions,
        touchedValues: touchedValues.current,
        values: values.current,
        valuesSubscriptions,
        valuesValidations: valuesValidations.current,
        initializedValues: initializedValues.current,
        initialValues: initialValues.current,
        valuesTypes: valuesTypes.current,
        value,
        updateInputValue: (value: any) => {
          if (typeof ref?.current === 'object' && ref?.current !== null) ref.current.value = value;
        },
        bindUnsubscribeFns: bindUnsubscribeFns.current,
        updateInputInvalid: (invalid) => {
          if (typeof ref?.current === 'object' && ref?.current !== null)
            ref.current.ariaInvalid = invalid ? 'true' : 'undefined';
        },
        validationMode: validationMode.current,
      });
      return { ...bindResult, ref };
    },
    [],
  );

  const bindRadio = useCallback(
    (name: FormName<TFormValues>, value: string, options?: BindOptions) => {
      const radioName = createCheckboxOrRadioName(name, value);
      const ref = setInputRef(radioName as string) as RefObject<HTMLInputElement>;
      const bindResult = _bindRadio({
        name,
        options,
        errors: errors.current,
        errorsSubscriptions,
        touchedSubscriptions,
        touchedValues: touchedValues.current,
        values: values.current,
        valuesSubscriptions,
        valuesValidations: valuesValidations.current,
        initializedValues: initializedValues.current,
        initialValues: initialValues.current,
        valuesTypes: valuesTypes.current,
        value,
        updateInputValue: (checked: any) => {
          if (typeof ref?.current === 'object' && ref?.current !== null)
            ref.current.checked = checked;
        },
        bindUnsubscribeFns: bindUnsubscribeFns.current,
        updateInputInvalid: (invalid) => {
          if (typeof ref?.current === 'object' && ref?.current !== null)
            ref.current.ariaInvalid = invalid ? 'true' : 'undefined';
        },
        validationMode: validationMode.current,
      });
      return { ...bindResult, ref };
    },
    [],
  );

  const bindNumber = useCallback((name: FormName<TFormValues>, options?: BindOptions) => {
    const ref = setInputRef(name as string) as RefObject<HTMLInputElement>;
    const bindResult = _bindNumber({
      name,
      options,
      errors: errors.current,
      errorsSubscriptions,
      touchedSubscriptions,
      touchedValues: touchedValues.current,
      values: values.current,
      valuesSubscriptions,
      valuesValidations: valuesValidations.current,
      initializedValues: initializedValues.current,
      initialValues: initialValues.current,
      valuesTypes: valuesTypes.current,
      updateInputValue: (value: any) => {
        if (typeof ref?.current === 'object' && ref?.current !== null) ref.current.value = value;
      },
      bindUnsubscribeFns: bindUnsubscribeFns.current,
      updateInputInvalid: (invalid) => {
        if (typeof ref?.current === 'object' && ref?.current !== null)
          ref.current.ariaInvalid = invalid ? 'true' : 'undefined';
      },
      validationMode: validationMode.current,
    });
    return { ...bindResult, ref };
  }, []);

  const reset = useCallback((val: DefaultValues<TFormValues>) => {
    _reset({
      touchedSubscriptions,
      touchedValues: touchedValues.current,
      val,
      values,
      valuesSubscriptions,
      valuesTypes: valuesTypes.current,
    });
  }, []);

  const setFocus = useCallback((name: FormName<TFormValues>) => {
    const ref = getInputRef(name as string);
    if (ref) ref.current?.focus();
  }, []);

  const submit = useCallback((submitFn: SubmitFn<TFormValues>) => {
    return _submit<TFormValues>({
      submitFn,
      errors: errors.current,
      errorsSubscriptions,
      onFocus: setFocus,
      onSubmitting: setIsSubmitting,
      values: values.current,
      valuesValidations: valuesValidations.current,
      changeValidationModeToOnChange: () => {
        if (validationMode.current.mode === 'onSubmit') validationMode.current.mode = 'onChange';
      },
    });
  }, []);

  const getErrors = useCallback(() => {
    return formatErrors(errors.current);
  }, []);

  return {
    bind,
    submit,
    getValue,
    setValue,
    reset,
    setFocus,
    getErrors,
    isSubmitting,
    bindCheckbox,
    bindRadio,
    bindNumber,
    $instance: {
      initializedValues: initializedValues.current,
      values: values.current,
      touchedValues: touchedValues.current,
      errors: errors.current,
      valuesValidations: valuesValidations.current,
      valuesSubscriptions,
      touchedSubscriptions,
      errorsSubscriptions,
      bindUnsubscribeFns: bindUnsubscribeFns.current,
      setInputRef,
      getInputRef,
      initialValues: initialValues?.current || {},
    },
  };
}

export default useForm;
