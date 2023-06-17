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
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';
import _touchValue from './touchValue';
import validateValue from './validateValue';

type BindNumberArgs<TFormValues> = {
  name: FormName<TFormValues>;
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
  } = args;

  const initialized = _initValue({
    initializedValues,
    initialValues,
    name,
    touchedValues,
    values,
  });
  valuesSubscriptions.initValueSubscription(name as string);
  _initValueValidation({
    name,
    valuesValidations,
    bindOptions: options,
  });
  _initValueType({
    name,
    type: 'number',
    valuesTypes,
  });

  if (typeof bindUnsubscribeFns[name] === 'function') bindUnsubscribeFns[name]();
  bindUnsubscribeFns[name] = valuesSubscriptions.subscribe(
    name as string,
    updateInputValue,
  ) as () => void;

  const onChange = (e: any) => {
    console.log('vlvlvl', valuesSubscriptions);

    const value = typeof e.target === 'object' ? parseInt(e.target.value) : e;
    validateValue(valuesValidations[name], name, value, errors, errorsSubscriptions);
    valuesSubscriptions.publish(name as string, value);
    values[name] = value;
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
