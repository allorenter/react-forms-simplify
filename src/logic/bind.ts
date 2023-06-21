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
} from '@/index';
import _initValue from './initValue';
import _initValueValidation from './initValueValidation';
import FormNameSubscriptions from './FormNameSubscriptions';
import _initValueType from './initValueType';
import validateValue from './validateValue';
import _touchValue from './touchValue';
import Subscriptions from './Subscriptions';
import initBindFormName from './initBindFormName';

type BindArgs<TFormValues> = {
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

function _bind<TFormValues extends Values = Values>(args: BindArgs<TFormValues>) {
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
    updateInputValue,
    valuesSubscriptions,
    valuesTypes,
    valuesValidations,
    options,
    type: 'text',
    errorsSubscriptions,
    updateInputInvalid,
  });

  const onChange = (e: any) => {
    const value = typeof e.target === 'object' ? e.target.value : e;
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
    defaultValue: initialized ? undefined : values[name],
  };
}

export default _bind;
