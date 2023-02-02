import { FormEvent, RefObject, useCallback, useRef, useState } from 'react';
import {
  BindValueOptions,
  Values,
  FormErrors,
  ValuesValidations,
  FormName,
  SubmitFn,
  TouchedValues,
  UseForm,
  UseFormParams,
  Validation,
} from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import transformValuesToFormValues from '@/logic/transformValuesToFormValues';
import transformFormValuesToValues from '@/logic/transformFormValuesToValues';
import validateValue from '@/logic/validateValue';
import formatErrors from '@/logic/formatErrors';
import { splitCheckboxName, createCheckboxName } from '@/logic/checkboxName';
import createValuesSubscriptions from '@/logic/createValuesSubscriptions';
import createTouchedSubscriptions from '@/logic/createTouchedSubscriptions';
import createErrorsSubscriptions from '@/logic/createErrorsSubscriptions';

function useForm<TFormValues extends Values = Values>(
  params?: UseFormParams,
): UseForm<TFormValues> {
  const valuesSubscriptions = createValuesSubscriptions(params?.$instance?.valuesSubscriptions);
  const touchedSubscriptions = createTouchedSubscriptions(params?.$instance?.touchedSubscriptions);
  const errorsSubscriptions = createErrorsSubscriptions(params?.$instance?.errorsSubscriptions);

  const values = useRef<Values>({} as Values);
  const [getValueRef, setValueRef] = useDynamicRefs<HTMLInputElement>();
  const touchedValues = useRef<TouchedValues>({});
  const errors = useRef<FormErrors>({});
  const valuesValidations = useRef<ValuesValidations>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initValue = useCallback((name: FormName<TFormValues>) => {
    if (!values.current[name]) {
      values.current[name] = '';
      touchedValues.current[name] = false;
    }
  }, []);

  const initValueValidation = useCallback(
    (name: FormName<TFormValues>, validation: Validation | undefined) => {
      if (validation !== undefined) {
        valuesValidations.current[name] = validation;
      }
    },
    [],
  );

  const touchValue = useCallback((name: FormName<TFormValues>, touch = true) => {
    // solo lo ejecuto en caso de querer cambiar su valor
    if (touchedValues.current[name] !== touch) {
      touchedValues.current[name] = touch;
      touchedSubscriptions.publish(touchedValues.current);
    }
  }, []);

  const getValue = useCallback((name?: FormName<TFormValues>) => {
    if (name === undefined) return transformValuesToFormValues(values.current);
    return values.current[name];
  }, []);

  const setValue = useCallback((name: FormName<TFormValues>, value: any) => {
    if (name in values.current) {
      validateValue(
        valuesValidations.current[name],
        name,
        value,
        errors.current,
        errorsSubscriptions,
      );
      values.current[name] = value;
      valuesSubscriptions.publish(name as string, value);
      touchValue(name);
    }
  }, []);

  const bind = useCallback((name: FormName<TFormValues>, options?: BindValueOptions) => {
    valuesSubscriptions.initValueSubscription(name as string);
    initValue(name);
    initValueValidation(name, options?.validation);
    const ref = setValueRef(name as string) as RefObject<HTMLInputElement>;

    const updateRefValue = (value: any) => {
      if (typeof ref?.current === 'object' && ref?.current !== null) {
        ref.current.value = value;
      }
    };

    valuesSubscriptions.subscribe(name as string, updateRefValue);

    const onChange = (e: any) => {
      const value = e.target.value;
      validateValue(
        valuesValidations.current[name],
        name,
        value,
        errors.current,
        errorsSubscriptions,
      );
      valuesSubscriptions.publish(name as string, value);
      values.current[name] = value;
      touchValue(name);
    };

    return {
      name,
      onChange,
      ref,
    };
  }, []);

  const bindCheckbox = useCallback(
    (name: FormName<TFormValues>, value: string, options?: BindValueOptions) => {
      const checkboxName = createCheckboxName(name, value);

      valuesSubscriptions.initValueSubscription(checkboxName as string);
      initValue(name);
      initValueValidation(name, options?.validation);

      const ref = setValueRef(checkboxName as string) as RefObject<HTMLInputElement>;

      const updateRefValue = (checked: any) => {
        if (typeof ref?.current === 'object' && ref?.current !== null) {
          ref.current.checked = checked;
        }
      };

      valuesSubscriptions.subscribe(checkboxName as string, updateRefValue);

      const onChange = (e: any) => {
        const checked = e.target.checked;
        if (!Array.isArray(values.current[name])) {
          values.current[name] = [];
        }

        if (checked) {
          values.current[name].push(value);
        } else {
          const unchecked = values.current[name].filter((val: string) => {
            return val !== value;
          });
          values.current[name] = unchecked;
        }

        validateValue(
          valuesValidations.current[name],
          name,
          values.current[name],
          errors.current,
          errorsSubscriptions,
        );
        valuesSubscriptions.publish(checkboxName as string, checked);

        touchValue(name);
      };

      return {
        name,
        ref,
        type: 'checkbox',
        value,
        onChange,
      };
    },
    [],
  );

  const reset = useCallback((val: TFormValues) => {
    const newValues = transformFormValuesToValues(val);
    values.current = newValues;

    Object.entries(newValues).forEach((entry) => {
      const [name, value] = entry;
      // es un checkbox
      if (Array.isArray(value)) {
        // recorro los checkboxValues suscritos y los pongo a false en caso de no estar en value
        const subscriptions = valuesSubscriptions.getAllSubscriptions();
        // me quedo con las suscripciones que tengan el name
        const filteredSubscriptions = Object.entries(subscriptions).filter(
          (subscriptionProperty) => {
            const [checkboxName] = subscriptionProperty;
            const [n] = splitCheckboxName(checkboxName);
            return n === name;
          },
        );
        filteredSubscriptions.forEach((subscriptionProp) => {
          const [checkboxName, subscription] = subscriptionProp;
          const [, v] = splitCheckboxName(checkboxName);
          subscription.publish(value.findIndex((arrV) => arrV !== v) === -1);
        });
      } else {
        valuesSubscriptions.publish(name, value);
      }
      touchValue(name as FormName<TFormValues>, false);
    });
  }, []);

  const setFocus = useCallback((name: FormName<TFormValues>) => {
    const ref = getValueRef(name as string);
    if (ref) ref.current?.focus();
  }, []);

  const submit = useCallback(
    (submitFn: SubmitFn) => (e: FormEvent<HTMLFormElement>) => {
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

      // si no hay erorres, valido todos los values de uno en uno
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
    $instance: {
      valuesSubscriptions,
      initValue,
      touchedSubscriptions,
      errorsSubscriptions,
      initValueValidation,
      setValueRef,
      getValueRef,
    },
  };
}

export default useForm;
