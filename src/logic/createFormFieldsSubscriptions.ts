import FormFieldsSubscriptions from './FormFieldsSubscriptions';

function createFormFieldsSubscriptions(useFormParam?: FormFieldsSubscriptions) {
  return useFormParam instanceof FormFieldsSubscriptions
    ? useFormParam
    : new FormFieldsSubscriptions();
}

export default createFormFieldsSubscriptions;
