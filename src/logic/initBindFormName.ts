import {
  BindOptions,
  BindUnsubscribeFns,
  FormName,
  TypeValues,
  ValidationValues,
  ValueType,
  Values,
} from '..';
import FormNameSubscriptions from './FormNameSubscriptions';
import _initValue from './initValue';
import _initValueType from './initValueType';
import _initValueValidation from './initValueValidation';

type InitBindFormName<TFormValues> = {
  name: FormName<TFormValues>;
  options?: BindOptions;
  valuesValidations: ValidationValues;
  valuesSubscriptions: FormNameSubscriptions;
  valuesTypes: TypeValues;
  updateInputValue: (value: any) => void;
  bindUnsubscribeFns: BindUnsubscribeFns;
  type: ValueType;
};

function initBindFormName<TFormValues extends Values = Values>(
  args: InitBindFormName<TFormValues>,
) {
  const {
    name,
    options,
    valuesValidations,
    valuesSubscriptions,
    valuesTypes,
    updateInputValue,
    bindUnsubscribeFns,
    type,
  } = args;

  valuesSubscriptions.initSubscription(name);
  _initValueValidation({
    name,
    valuesValidations,
    bindOptions: options,
  });
  _initValueType({
    name,
    type,
    valuesTypes,
  });

  if (typeof bindUnsubscribeFns[name] === 'function') bindUnsubscribeFns[name]();
  bindUnsubscribeFns[name] = valuesSubscriptions.subscribe(
    name as string,
    updateInputValue,
  ) as () => void;
}

export default initBindFormName;
