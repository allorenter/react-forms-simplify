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
import initBindSubscription from './initBindSubscription';
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
  errorsSubscriptions: FormNameSubscriptions;
  updateInputInvalid: (value: boolean) => void;
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
    errorsSubscriptions,
    updateInputInvalid,
  } = args;
  errorsSubscriptions.initSubscription(name);
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
  initBindSubscription({
    bindUnsubscribeFns,
    errorsSubscriptions,
    name,
    updateInputValue,
    valuesSubscriptions,
    updateInputInvalid,
  });
}

export default initBindFormName;
