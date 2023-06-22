import { FormName, Values } from '@/index';
import transformValuesToFormValues from './transformValuesToFormValues';

type GetValueArgs<TFormValues> = {
  name?: FormName<TFormValues>;
  values: Values;
};

function _getValue<TFormValues extends Values = Values>(args: GetValueArgs<TFormValues>) {
  const { name, values } = args;
  if (name === undefined) return transformValuesToFormValues(values);
  return values[name];
}

export default _getValue;
