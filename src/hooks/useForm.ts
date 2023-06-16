import { FormEvent, RefObject, useCallback, useRef, useState } from 'react';
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
} from '@/types/Form';
import useInputElementRefs from './useInputElementRefs';
import transformValuesToFormValues from '@/logic/transformValuesToFormValues';
import validateValue from '@/logic/validateValue';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initValue = useCallback((name: FormName<TFormValues>) => {
    return _initValue({
      name,
      initializedValues: initializedValues.current,
      touchedValues: touchedValues.current,
      values: values.current,
      initialValues: initialValues.current,
    });
  }, []);

  const initValueValidation = useCallback(
    (name: FormName<TFormValues>, bindOptions: BindOptions | undefined) => {
      _initValueValidation({
        name,
        bindOptions,
        valuesValidations: valuesValidations.current,
      });
    },
    [],
  );

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

  const submit = useCallback(
    (submitFn: SubmitFn<TFormValues>) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasError = () => {
        return Object.values(errors.current).some((val) => val !== undefined);
      };

      // hace focus sobre el value del primer error encontrado (se ha seteado previamente en un onChange, onBlur, etc)
      const focusError = () => {
        const errorsValues = Object.entries(errors.current)
          .filter((entry) => {
            return entry[1] !== undefined;
          })
          .map((entry) => {
            return entry[1]?.name;
          });
        if (errorsValues[0]) {
          setFocus(errorsValues[0] as FormName<TFormValues>);
          return;
        }
      };

      if (hasError()) return focusError();

      // si no hay errores, válido todos los values de uno en uno
      const validationsValues = Object.keys(valuesValidations.current);
      for (const name of validationsValues) {
        validateValue(
          valuesValidations.current[name],
          name,
          values.current[name],
          errors.current,
          errorsSubscriptions,
        );
        if (hasError()) return focusError();
      }

      const formatted = transformValuesToFormValues(values.current);
      setIsSubmitting(true);
      try {
        return submitFn(formatted as TFormValues).finally(() => {
          setIsSubmitting(false);
        });
      } catch (e) {
        if (e instanceof TypeError) {
          // ejecuto promesa para que isSubmitting sea true y después false
          new Promise((resolve) => {
            resolve('');
          }).then(() => {
            setIsSubmitting(false);
          });
        }
      }
    },
    [],
  );

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
      valuesSubscriptions,
      initValue,
      touchedSubscriptions,
      errorsSubscriptions,
      initValueValidation,
      setInputRef,
      getInputRef,
      initialValues: initialValues?.current || {},
    },
  };
}

export default useForm;
