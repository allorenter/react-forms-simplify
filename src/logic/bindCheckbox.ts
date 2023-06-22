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
  ValidationMode,
  ValidationValues,
  Values,
} from '..';
import Subscriptions from './Subscriptions';
import FormNameSubscriptions from './FormNameSubscriptions';
import { createCheckboxOrRadioName } from './checkboxOrRadioName';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';
import initBindFormName from './initBindFormName';

type BindCheckboxArgs<TFormValues> = {
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
  validationMode: { mode: ValidationMode };
};

function _bindCheckbox<TFormValues extends Values = Values>(args: BindCheckboxArgs<TFormValues>) {
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
    validationMode,
  } = args;

  const checkboxName = createCheckboxOrRadioName(name, value);
  valuesSubscriptions.initSubscription(checkboxName as string);
  _initValue({
    initializedValues,
    initialValues,
    name,
    touchedValues,
    values,
  });
  initBindFormName({
    bindUnsubscribeFns,
    name,
    type: 'checkbox',
    updateInputValue,
    valuesSubscriptions,
    valuesTypes,
    valuesValidations,
    options,
    errorsSubscriptions,
    updateInputInvalid,
  });
  valuesSubscriptions.subscribe(checkboxName as string, updateInputValue);

  const onChange = (e: any) => {
    const checked = e.target.checked;
    if (!Array.isArray(values[name])) {
      values[name] = [];
    }
    if (checked) {
      values[name].push(value);
    } else {
      const unchecked = values[name].filter((val: string) => {
        return val !== value;
      });
      values[name] = unchecked;
    }
    if (validationMode.mode === 'onChange') {
      validateValue(valuesValidations[name], name, values[name], errors, errorsSubscriptions);
    }
    valuesSubscriptions.publish(checkboxName as string, checked);
    valuesSubscriptions.publish(name as string, values[name]);
    _touchValue({ name, touch: true, touchedSubscriptions, touchedValues });
    if (typeof options?.onChange === 'function') options.onChange(e);
  };

  return {
    name,
    type: 'checkbox',
    value,
    onChange,
    defaultChecked: Array.isArray(values[name])
      ? values[name].findIndex((val: string) => val === value) !== -1
      : undefined,
  };
}

export default _bindCheckbox;
