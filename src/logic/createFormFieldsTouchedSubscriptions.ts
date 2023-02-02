import FormFieldsTouchedSubscriptions from './FormFieldsTouchedSubscriptions';

function createFormFieldsTouchedSubscriptions(useFormParam?: FormFieldsTouchedSubscriptions) {
  return useFormParam instanceof FormFieldsTouchedSubscriptions
    ? useFormParam
    : new FormFieldsTouchedSubscriptions();
}

export default createFormFieldsTouchedSubscriptions;
