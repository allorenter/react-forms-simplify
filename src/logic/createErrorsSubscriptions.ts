import FormNameSubscriptions from './FormNameSubscriptions';

function createErrorsSubscriptions(useFormParam?: FormNameSubscriptions) {
  return useFormParam instanceof FormNameSubscriptions ? useFormParam : new FormNameSubscriptions();
}

export default createErrorsSubscriptions;
