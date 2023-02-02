import FormFieldsErrorsSubscriptions from './FormFieldsErrorsSubscriptions';

function createFormFieldsErrorsSubscriptions(useFormParam?: FormFieldsErrorsSubscriptions) {
  return useFormParam instanceof FormFieldsErrorsSubscriptions
    ? useFormParam
    : new FormFieldsErrorsSubscriptions();
}

export default createFormFieldsErrorsSubscriptions;
