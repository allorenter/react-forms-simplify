import { FormErrors, FormName, SubmitFn, ValidationValues, Values } from '@/index';
import { FormEvent } from 'react';
import validateValue from './validateValue';
import transformValuesToFormValues from './transformValuesToFormValues';
import FormNameSubscriptions from './FormNameSubscriptions';

type SubmitArgs<TFormValues extends Values = Values> = {
  submitFn: SubmitFn<TFormValues>;
  errors: FormErrors;
  valuesValidations: ValidationValues;
  values: Values;
  errorsSubscriptions: FormNameSubscriptions;
  onSubmitting: (isSubmitting: boolean) => void;
  onFocus: (name: FormName<TFormValues>) => void;
};

function _submit<TFormValues extends Values = Values>(args: SubmitArgs<TFormValues>) {
  const {
    submitFn,
    errors,
    valuesValidations,
    values,
    errorsSubscriptions,
    onSubmitting,
    onFocus,
  } = args;

  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasError = () => {
      return Object.values(errors).some((val) => val !== undefined);
    };

    // hace focus sobre el value del primer error encontrado (se ha seteado previamente en un onChange, onBlur, etc)
    const focusError = () => {
      const errorsValues = Object.entries(errors)
        .filter((entry) => {
          return entry[1] !== undefined;
        })
        .map((entry) => {
          return entry[1]?.name;
        });
      if (errorsValues[0]) {
        onFocus(errorsValues[0] as FormName<TFormValues>);
        return;
      }
    };

    if (hasError()) return focusError();

    // si no hay errores, válido todos los values de uno en uno
    const validationsValues = Object.keys(valuesValidations);
    for (const name of validationsValues) {
      validateValue(valuesValidations[name], name, values[name], errors, errorsSubscriptions);
      if (hasError()) return focusError();
    }

    const formatted = transformValuesToFormValues(values);
    onSubmitting(true);
    try {
      return submitFn(formatted as TFormValues).finally(() => {
        onSubmitting(false);
      });
    } catch (e) {
      if (e instanceof TypeError) {
        // ejecuto promesa para que isSubmitting sea true y después false
        new Promise((resolve) => {
          resolve('');
        }).then(() => {
          onSubmitting(false);
        });
      }
    }
  };
}

export default _submit;
