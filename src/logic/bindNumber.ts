import {
  BindOptions,
  BindUnsubscribeFns,
  FormErrors,
  FormName,
  InitializedValues,
  TouchedValues,
  TypeValues,
  UpdateInputInvalid,
  UpdateInputValue,
  ValidationValues,
  Values,
} from '..';
import Subscriptions from './Subscriptions';
import FormNameSubscriptions from './FormNameSubscriptions';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';
import initBindFormName from './initBindFormName';

type BindNumberArgs<TFormValues> = {
  name: FormName<TFormValues>;
  options?: BindOptions;
  initializedValues: InitializedValues;
  touchedValues: TouchedValues;
  values: Values;
  initialValues: any;
  valuesValidations: ValidationValues;
  valuesSubscriptions: FormNameSubscriptions;
  valuesTypes: TypeValues;
  errors: FormErrors;
  errorsSubscriptions: FormNameSubscriptions;
  touchedSubscriptions: Subscriptions;
  updateInputValue: UpdateInputValue;
  bindUnsubscribeFns: BindUnsubscribeFns;
  updateInputInvalid: UpdateInputInvalid;
};

function _bindNumber<TFormValues extends Values = Values>(args: BindNumberArgs<TFormValues>) {
  const {
    initialValues,
    initializedValues,
    name,
    touchedValues,
    values,
    options,
    valuesValidations,
    valuesSubscriptions,
    valuesTypes,
    errors,
    errorsSubscriptions,
    touchedSubscriptions,
    updateInputValue,
    bindUnsubscribeFns,
    updateInputInvalid,
  } = args;

  const initialized = _initValue({
    initializedValues,
    initialValues,
    name,
    touchedValues,
    values,
  });
  initBindFormName({
    bindUnsubscribeFns,
    name,
    type: 'number',
    updateInputValue,
    valuesSubscriptions,
    valuesTypes,
    valuesValidations,
    options,
    errorsSubscriptions,
    updateInputInvalid,
  });

  const onChange = (e: any) => {
    const value = typeof e.target === 'object' ? parseInt(e.target.value) : e;
    validateValue(valuesValidations[name], name, value, errors, errorsSubscriptions);
    values[name] = value;
    valuesSubscriptions.publish(name as string, value);
    _touchValue({
      name,
      touch: true,
      touchedSubscriptions,
      touchedValues,
    });
    if (typeof options?.onChange === 'function') options.onChange(e);
  };

  return {
    name,
    onChange,
    type: 'number',
    defaultValue: initialized ? undefined : values[name],
  };
}

export default _bindNumber;
