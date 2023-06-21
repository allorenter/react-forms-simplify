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
import Subscriptions from './Subscriptions';
import FormNameSubscriptions from './FormNameSubscriptions';
import { createCheckboxOrRadioName } from './checkboxOrRadioName';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';
import initBindFormName from './initBindFormName';

type BindRadioArgs<TFormValues> = {
  name: FormName<TFormValues>;
  value: string;
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

function _bindRadio<TFormValues extends Values = Values>(args: BindRadioArgs<TFormValues>) {
  const {
    initialValues,
    initializedValues,
    name,
    value,
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

  const radioName = createCheckboxOrRadioName(name, value);
  valuesSubscriptions.initSubscription(radioName as string);
  _initValue({
    initializedValues,
    name,
    initialValues,
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
    type: 'radio',
    errorsSubscriptions,
    updateInputInvalid,
  });

  const onChange = (e: any) => {
    values[name] = value;
    validateValue(valuesValidations[name], name, values[name], errors, errorsSubscriptions);
    valuesSubscriptions.publish(name as string, values[name]);
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
    type: 'radio',
    value,
    onChange,
    defaultChecked: value === values[name],
  };
}

export default _bindRadio;
