import { FormName, TypeValues, ValueType, Values } from '@/index';

type InitValueTypeArgs<TFormValues> = {
  name: FormName<TFormValues>;
  type: ValueType;
  valuesTypes: TypeValues;
};

function _initValueType<TFormValues extends Values = Values>(args: InitValueTypeArgs<TFormValues>) {
  const { valuesTypes, name, type } = args;
  valuesTypes[name] = type;
}

export default _initValueType;
