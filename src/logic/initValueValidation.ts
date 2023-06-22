import { BindOptions, FormName, ValidationValues, Values } from '@/index';
import bindOptionsToValidation from './bindOptionsToValidation';

type InitValueValidationArgs<TFormValues extends Values = Values> = {
  name: FormName<TFormValues>;
  valuesValidations: ValidationValues;
  bindOptions?: BindOptions;
};

function _initValueValidation<TFormValues extends Values = Values>(
  args: InitValueValidationArgs<TFormValues>,
) {
  const { name, valuesValidations, bindOptions } = args;
  if (bindOptions !== undefined) {
    const validation = bindOptionsToValidation(bindOptions);

    if (validation !== null) valuesValidations[name] = validation;
  }
}

export default _initValueValidation;
