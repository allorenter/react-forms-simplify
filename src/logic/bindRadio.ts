import {
  BindOptions,
  BindUnsubscribeFns,
  FormErrors,
  FormName,
  InitializedValues,
  TouchedValues,
  TypeValues,
  ValidationValues,
  Values,
} from '@/index';
import ErrorsSubscriptions from './ErrorsSubscriptions';
import TouchedSubscriptions from './TouchedSubscriptions';
import FormNameSubscriptions from './FormNameSubscriptions';
import { createCheckboxOrRadioName } from './checkboxOrRadioName';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';

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
  errorsSubscriptions: ErrorsSubscriptions;
  touchedSubscriptions: TouchedSubscriptions;
  updateInputValue: (value: any) => void;
  bindUnsubscribeFns: BindUnsubscribeFns;
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
  } = args;

  const radioName = createCheckboxOrRadioName(name, value);
  _initValue({
    initializedValues,
    name,
    initialValues,
    touchedValues,
    values,
  });
  valuesSubscriptions.initSubscription(name);
  valuesSubscriptions.initSubscription(radioName as string);
  _initValueValidation({
    name,
    valuesValidations,
    bindOptions: options,
  });
  _initValueType({
    name,
    type: 'radio',
    valuesTypes,
  });

  if (typeof bindUnsubscribeFns[name] === 'function') bindUnsubscribeFns[name]();
  bindUnsubscribeFns[name] = valuesSubscriptions.subscribe(
    name as string,
    updateInputValue,
  ) as () => void;

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
