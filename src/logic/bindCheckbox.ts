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
} from '..';
import ErrorsSubscriptions from './ErrorsSubscriptions';
import TouchedSubscriptions from './TouchedSubscriptions';
import ValuesSubscriptions from './ValuesSubscriptions';
import { createCheckboxOrRadioName } from './checkboxOrRadioName';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';

type BindCheckboxArgs<TFormValues> = {
  name: FormName<TFormValues>;
  value: string;
  options?: BindOptions;
  initializedValues: InitializedValues;
  touchedValues: TouchedValues;
  values: Values;
  initialValues: any;
  valuesValidations: ValidationValues;
  valuesSubscriptions: ValuesSubscriptions;
  valuesTypes: TypeValues;
  errors: FormErrors;
  errorsSubscriptions: ErrorsSubscriptions;
  touchedSubscriptions: TouchedSubscriptions;
  updateInputValue: (value: any) => void;
  bindUnsubscribeFns: BindUnsubscribeFns;
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
  } = args;

  const checkboxName = createCheckboxOrRadioName(name, value);
  valuesSubscriptions.initValueSubscription(name);
  valuesSubscriptions.initValueSubscription(checkboxName as string);
  _initValue({
    initializedValues,
    initialValues,
    name,
    touchedValues,
    values,
  });
  _initValueValidation({
    name,
    valuesValidations,
    bindOptions: options,
  });
  _initValueType({
    name,
    type: 'checkbox',
    valuesTypes,
  });

  if (typeof bindUnsubscribeFns[name] === 'function') bindUnsubscribeFns[name]();
  bindUnsubscribeFns[name] = valuesSubscriptions.subscribe(
    name as string,
    updateInputValue,
  ) as () => void;
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
    validateValue(valuesValidations[name], name, values[name], errors, errorsSubscriptions);
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
