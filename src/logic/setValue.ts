import { FormErrors, FormName, FormValue, TouchedValues, ValidationValues, Values } from '@/index';
import validateValue from './validateValue';
import ErrorsSubscriptions from './ErrorsSubscriptions';
import FormNameSubscriptions from './FormNameSubscriptions';
import _touchValue from './touchValue';
import TouchedSubscriptions from './TouchedSubscriptions';

type SetValueArgs<TFormValues extends Values = Values> = {
  name: FormName<TFormValues>;
  value: FormValue<TFormValues, FormName<TFormValues>>;
  values: Values;
  valuesValidations: ValidationValues;
  errors: FormErrors;
  errorsSubscriptions: ErrorsSubscriptions;
  valuesSubscriptions: FormNameSubscriptions;
  touchedSubscriptions: TouchedSubscriptions;
  touchedValues: TouchedValues;
};

function _setValue<TFormValues extends Values>(args: SetValueArgs<TFormValues>) {
  const {
    name,
    values,
    valuesValidations,
    value,
    errors,
    errorsSubscriptions,
    valuesSubscriptions,
    touchedSubscriptions,
    touchedValues,
  } = args;

  if (name in values) {
    validateValue(valuesValidations[name], name, value, errors, errorsSubscriptions);
    values[name] = value;
    valuesSubscriptions.publish(name as string, value);
    _touchValue({
      name,
      touch: true,
      touchedSubscriptions,
      touchedValues,
    });
  }
}

export default _setValue;
