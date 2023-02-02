import { FormEvent, RefObject, useCallback, useRef, useState } from 'react';
import {
  BindFormFieldOptions,
  FormFields,
  FormErrors,
  FormFieldsValidations,
  FormName,
  SubmitFn,
  TouchedFormFields,
  UseForm,
  UseFormParams,
  Validation,
} from '@/types/Form';
import useDynamicRefs from './useDynamicRef';
import transformFormFieldsToFormValues from '@/logic/transformFormFieldsToFormValues';
import transformFormValuesToFormFields from '@/logic/transformFormValuesToFormFields';
import validateFormField from '@/logic/validateFormField';
import formatErrors from '@/logic/formatErrors';
import { splitCheckboxName, createCheckboxName } from '@/logic/checkboxName';
import createFormFieldsSubscriptions from '@/logic/createFormFieldsSubscriptions';
import createFormFieldsTouchedSubscriptions from '@/logic/createFormFieldsTouchedSubscriptions';
import createErrorsSubscriptions from '@/logic/createErrorsSubscriptions';

function useForm<TFormValues extends FormFields = FormFields>(
  params?: UseFormParams,
): UseForm<TFormValues> {
  const formFieldsSubscriptions = createFormFieldsSubscriptions(
    params?.$instance?.formFieldsSubscriptions,
  );

  const formFieldsTouchedSubscriptions = createFormFieldsTouchedSubscriptions(
    params?.$instance?.formFieldsTouchedSubscriptions,
  );

  const formFieldsErrorsSubscriptions = createErrorsSubscriptions(
    params?.$instance?.formFieldsErrorsSubscriptions,
  );

  const formFields = useRef<FormFields>({} as FormFields);
  const [getFormFieldRef, setFormFieldRef] = useDynamicRefs<HTMLInputElement>();
  const touchedFormFields = useRef<TouchedFormFields>({});
  const formFieldsErrors = useRef<FormErrors>({});
  const formFieldsValidations = useRef<FormFieldsValidations>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initFormField = useCallback((name: FormName<TFormValues>) => {
    if (!formFields.current[name]) {
      formFields.current[name] = '';
      touchedFormFields.current[name] = false;
    }
  }, []);

  const initFormFieldValidation = useCallback(
    (name: FormName<TFormValues>, validation: Validation | undefined) => {
      if (validation !== undefined) {
        formFieldsValidations.current[name] = validation;
      }
    },
    [],
  );

  const touchFormField = useCallback((name: FormName<TFormValues>, touch = true) => {
    // solo lo ejecuto en caso de querer cambiar su valor
    if (touchedFormFields.current[name] !== touch) {
      touchedFormFields.current[name] = touch;
      formFieldsTouchedSubscriptions.publish(touchedFormFields.current);
    }
  }, []);

  const getValue = useCallback((name?: FormName<TFormValues>) => {
    if (name === undefined) return transformFormFieldsToFormValues(formFields.current);
    return formFields.current[name];
  }, []);

  const setValue = useCallback((name: FormName<TFormValues>, value: any) => {
    if (name in formFields.current) {
      validateFormField(
        formFieldsValidations.current[name],
        name,
        value,
        formFieldsErrors.current,
        formFieldsErrorsSubscriptions,
      );
      formFields.current[name] = value;
      formFieldsSubscriptions.publish(name as string, value);
      touchFormField(name);
    }
  }, []);

  const bind = useCallback((name: FormName<TFormValues>, options?: BindFormFieldOptions) => {
    formFieldsSubscriptions.initFormFieldSubscription(name as string);
    initFormField(name);
    initFormFieldValidation(name, options?.validation);
    const ref = setFormFieldRef(name as string) as RefObject<HTMLInputElement>;

    const updateRefValue = (value: any) => {
      if (typeof ref?.current === 'object' && ref?.current !== null) {
        ref.current.value = value;
      }
    };

    formFieldsSubscriptions.subscribe(name as string, updateRefValue);

    const onChange = (e: any) => {
      const value = e.target.value;
      validateFormField(
        formFieldsValidations.current[name],
        name,
        value,
        formFieldsErrors.current,
        formFieldsErrorsSubscriptions,
      );
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

  const bindCheckbox = useCallback(
    (name: FormName<TFormValues>, value: string, options?: BindFormFieldOptions) => {
      const checkboxName = createCheckboxName(name, value);

      formFieldsSubscriptions.initFormFieldSubscription(checkboxName as string);
      initFormField(name);
      initFormFieldValidation(name, options?.validation);

      const ref = setFormFieldRef(checkboxName as string) as RefObject<HTMLInputElement>;

      const updateRefValue = (checked: any) => {
        if (typeof ref?.current === 'object' && ref?.current !== null) {
          ref.current.checked = checked;
        }
      };

      formFieldsSubscriptions.subscribe(checkboxName as string, updateRefValue);

      const onChange = (e: any) => {
        const checked = e.target.checked;
        if (!Array.isArray(formFields.current[name])) {
          formFields.current[name] = [];
        }

        if (checked) {
          formFields.current[name].push(value);
        } else {
          const unchecked = formFields.current[name].filter((val: string) => {
            return val !== value;
          });
          formFields.current[name] = unchecked;
        }

        validateFormField(
          formFieldsValidations.current[name],
          name,
          formFields.current[name],
          formFieldsErrors.current,
          formFieldsErrorsSubscriptions,
        );
        formFieldsSubscriptions.publish(checkboxName as string, checked);

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
    const newFormFields = transformFormValuesToFormFields(values);
    formFields.current = newFormFields;

    Object.entries(newFormFields).forEach((entry) => {
      const [name, value] = entry;
      // es un checkbox
      if (Array.isArray(value)) {
        // recorro los checkboxNames suscritos y los pongo a false en caso de no estar en value
        const subscriptions = formFieldsSubscriptions.getAllSubscriptions();
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
        formFieldsSubscriptions.publish(name, value);
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
        return Object.values(formFieldsErrors.current).some((val) => val !== undefined);
      };

      // hace focus sobre el formField del primer error encontrado (se ha seteado previamente en un onChange, onBlur, etc)
      const focusError = () => {
        const errorsNames = Object.entries(formFieldsErrors.current)
          .filter((entry) => {
            return entry[1] !== undefined;
          })
          .map((entry) => {
            return entry[1]?.name;
          });
        if (errorsNames[0]) {
          setFocus(errorsNames[0] as FormName<TFormValues>);
          return;
        }
      };

      if (hasError()) return focusError();

      // si no hay erorres, valido todos los formFields de uno en uno
      const validationsNames = Object.keys(formFieldsValidations.current);
      for (const name of validationsNames) {
        validateFormField(
          formFieldsValidations.current[name],
          name,
          formFields.current[name],
          formFieldsErrors.current,
          formFieldsErrorsSubscriptions,
        );
        if (hasError()) return focusError();
      }

      const formatted = transformFormFieldsToFormValues(formFields.current);

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
    return formatErrors(formFieldsErrors.current);
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
      formFieldsSubscriptions,
      initFormField,
      formFieldsTouchedSubscriptions,
      formFieldsErrorsSubscriptions,
      initFormFieldValidation,
      setFormFieldRef,
      getFormFieldRef,
    },
  };
}

export default useForm;
