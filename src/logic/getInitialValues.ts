import { RecursivePartial, SplitNestedValue } from '@/types/Utils';

function getInitialValues<TFormValues>(
  defaultValues?: SplitNestedValue<RecursivePartial<TFormValues>>,
) {
  return typeof defaultValues === 'object' && defaultValues && Object.keys(defaultValues).length > 0
    ? defaultValues
    : {};
}

export default getInitialValues;
