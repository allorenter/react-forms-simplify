import { FormName, InitializedValues, TouchedValues, Values } from '..';

type InitValueArgs<TFormValues> = {
  name: FormName<TFormValues>;
  initializedValues: InitializedValues;
  touchedValues: TouchedValues;
  values: Values;
  initialValues: any;
};

// retorna un booleano para indicar si el valor ya ha sido inicializado previamente
function _initValue<TFormValues extends Values = Values>(args: InitValueArgs<TFormValues>) {
  const { initializedValues, name, touchedValues, values, initialValues } = args;
  const initialized = initializedValues[name];
  if (!initialized) {
    values[name] = initialValues[name] ? initialValues[name] : '';
    touchedValues[name] = false;
    initializedValues[name] = true;
    return false;
  }
  return true;
}

export default _initValue;
