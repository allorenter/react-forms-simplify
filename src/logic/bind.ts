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
import _initValue from './initValue';
import _initValueValidation from './initValueValidation';
import FormNameSubscriptions from './FormNameSubscriptions';
import _initValueType from './initValueType';
import validateValue from './validateValue';
import ErrorsSubscriptions from './ErrorsSubscriptions';
import _touchValue from './touchValue';
import TouchedSubscriptions from './TouchedSubscriptions';

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
  errorsSubscriptions: ErrorsSubscriptions;
  touchedSubscriptions: TouchedSubscriptions;
  updateInputValue: (value: any) => void;
  bindUnsubscribeFns: BindUnsubscribeFns;
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
  } = args;

  const initialized = _initValue({
    initializedValues,
    initialValues,
    name,
    touchedValues,
    values,
  });
  valuesSubscriptions.initSubscription(name as string);
  _initValueValidation({
    name,
    valuesValidations,
    bindOptions: options,
  });
  _initValueType({
    name,
    type: 'text',
    valuesTypes,
  });

  if (typeof bindUnsubscribeFns[name] === 'function') bindUnsubscribeFns[name]();
  bindUnsubscribeFns[name] = valuesSubscriptions.subscribe(
    name as string,
    updateInputValue,
  ) as () => void;

  const onChange = (e: any) => {
    const value = typeof e.target === 'object' ? e.target.value : e;
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
    defaultValue: initialized ? undefined : values[name],
  };
}

export default _bind;
