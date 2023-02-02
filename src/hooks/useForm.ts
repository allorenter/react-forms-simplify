import { FormEvent, RefObject, useCallback, useRef, useState } from 'react';
import {
  BindFormFieldOptions,
  NamesValues,
  FormErrors,
  NamesValuesValidations,
  FormName,
  SubmitFn,
  TouchedNamesValues,
  UseForm,
  UseFormParams,
  Validation,
} from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import transformNamesValuesToFormValues from '@/logic/transformNamesValuesToFormValues';
import transformFormValuesToNamesValues from '@/logic/transformFormValuesToNamesValues';
import validateFormField from '@/logic/validateFormField';
import formatErrors from '@/logic/formatErrors';
import { splitCheckboxName, createCheckboxName } from '@/logic/checkboxName';
import createNamesValuesSubscriptions from '@/logic/createNamesValuesSubscriptions';
import createTouchedSubscriptions from '@/logic/createTouchedSubscriptions';
import createErrorsSubscriptions from '@/logic/createErrorsSubscriptions';

function useForm<TFormValues extends NamesValues = NamesValues>(
  params?: UseFormParams,
): UseForm<TFormValues> {
  const namesValuesSubscriptions = createNamesValuesSubscriptions(
    params?.$instance?.namesValuesSubscriptions,
  );
  const touchedSubscriptions = createTouchedSubscriptions(params?.$instance?.touchedSubscriptions);
  const errorsSubscriptions = createErrorsSubscriptions(params?.$instance?.errorsSubscriptions);

  const namesValues = useRef<NamesValues>({} as NamesValues);
  const [getFormFieldRef, setFormFieldRef] = useDynamicRefs<HTMLInputElement>();
  const touchedNamesValues = useRef<TouchedNamesValues>({});
  const errors = useRef<FormErrors>({});
  const namesValuesValidations = useRef<NamesValuesValidations>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initFormField = useCallback((name: FormName<TFormValues>) => {
    if (!namesValues.current[name]) {
      namesValues.current[name] = '';
      touchedNamesValues.current[name] = false;
    }
  }, []);

  const initFormFieldValidation = useCallback(
    (name: FormName<TFormValues>, validation: Validation | undefined) => {
      if (validation !== undefined) {
        namesValuesValidations.current[name] = validation;
      }
    },
    [],
  );

  const touchFormField = useCallback((name: FormName<TFormValues>, touch = true) => {
    // solo lo ejecuto en caso de querer cambiar su valor
    if (touchedNamesValues.current[name] !== touch) {
      touchedNamesValues.current[name] = touch;
      touchedSubscriptions.publish(touchedNamesValues.current);
    }
  }, []);

  const getValue = useCallback((name?: FormName<TFormValues>) => {
    if (name === undefined) return transformNamesValuesToFormValues(namesValues.current);
    return namesValues.current[name];
  }, []);

  const setValue = useCallback((name: FormName<TFormValues>, value: any) => {
    if (name in namesValues.current) {
      validateFormField(
        namesValuesValidations.current[name],
        name,
        value,
        errors.current,
        errorsSubscriptions,
      );
      namesValues.current[name] = value;
      namesValuesSubscriptions.publish(name as string, value);
      touchFormField(name);
    }
  }, []);

  const bind = useCallback((name: FormName<TFormValues>, options?: BindFormFieldOptions) => {
    namesValuesSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    initFormFieldValidation(name, options?.validation);
    const ref = setFormFieldRef(name as string) as RefObject<HTMLInputElement>;

    const updateRefValue = (value: any) => {
      if (typeof ref?.current === 'object' && ref?.current !== null) {
        ref.current.value = value;
      }
    };

    namesValuesSubscriptions.subscribe(name as string, updateRefValue);

    const onChange = (e: any) => {
      const value = e.target.value;
      validateFormField(
        namesValuesValidations.current[name],
        name,
        value,
        errors.current,
        errorsSubscriptions,
      );
      namesValuesSubscriptions.publish(name as string, value);
      namesValues.current[name] = value;
      touchFormField(name);
    };

    return {
      name,
      onChange,
      ref,
    };
  }, []);

  const bindCheckbox = useCallback(
    (name: FormName<TFormValues>, value: string, options?: BindFormFieldOptions) => {
      const checkboxName = createCheckboxName(name, value);

      namesValuesSubscriptions.initFormFieldSubscription(checkboxName as string);
      initFormField(name);
      initFormFieldValidation(name, options?.validation);

      const ref = setFormFieldRef(checkboxName as string) as RefObject<HTMLInputElement>;

      const updateRefValue = (checked: any) => {
        if (typeof ref?.current === 'object' && ref?.current !== null) {
          ref.current.checked = checked;
        }
      };

      namesValuesSubscriptions.subscribe(checkboxName as string, updateRefValue);

      const onChange = (e: any) => {
        const checked = e.target.checked;
        if (!Array.isArray(namesValues.current[name])) {
          namesValues.current[name] = [];
        }

        if (checked) {
          namesValues.current[name].push(value);
        } else {
          const unchecked = namesValues.current[name].filter((val: string) => {
            return val !== value;
          });
          namesValues.current[name] = unchecked;
        }

        validateFormField(
          namesValuesValidations.current[name],
          name,
          namesValues.current[name],
          errors.current,
          errorsSubscriptions,
        );
        namesValuesSubscriptions.publish(checkboxName as string, checked);

        touchFormField(name);
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

  const reset = useCallback((values: TFormValues) => {
    const newNamesValues = transformFormValuesToNamesValues(values);
    namesValues.current = newNamesValues;

    Object.entries(newNamesValues).forEach((entry) => {
      const [name, value] = entry;
      // es un checkbox
      if (Array.isArray(value)) {
        // recorro los checkboxNamesValues suscritos y los pongo a false en caso de no estar en value
        const subscriptions = namesValuesSubscriptions.getAllSubscriptions();
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
        namesValuesSubscriptions.publish(name, value);
      }
      touchFormField(name as FormName<TFormValues>, false);
    });
  }, []);

  const setFocus = useCallback((name: FormName<TFormValues>) => {
    const ref = getFormFieldRef(name as string);
    if (ref) ref.current?.focus();
  }, []);

  const submit = useCallback(
    (submitFn: SubmitFn) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasError = () => {
        return Object.values(errors.current).some((val) => val !== undefined);
      };

      // hace focus sobre el formField del primer error encontrado (se ha seteado previamente en un onChange, onBlur, etc)
      const focusError = () => {
        const errorsNamesValues = Object.entries(errors.current)
          .filter((entry) => {
            return entry[1] !== undefined;
          })
          .map((entry) => {
            return entry[1]?.name;
          });
        if (errorsNamesValues[0]) {
          setFocus(errorsNamesValues[0] as FormName<TFormValues>);
          return;
        }
      };

      if (hasError()) return focusError();

      // si no hay erorres, valido todos los namesValues de uno en uno
      const validationsNamesValues = Object.keys(namesValuesValidations.current);
      for (const name of validationsNamesValues) {
        validateFormField(
          namesValuesValidations.current[name],
          name,
          namesValues.current[name],
          errors.current,
          errorsSubscriptions,
        );
        if (hasError()) return focusError();
      }

      const formatted = transformNamesValuesToFormValues(namesValues.current);

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
      namesValuesSubscriptions,
      initFormField,
      touchedSubscriptions,
      errorsSubscriptions,
      initFormFieldValidation,
      setFormFieldRef,
      getFormFieldRef,
    },
  };
}

export default useForm;
