import FormNameSubscriptions from './FormNameSubscriptions';

function createValuesSubscriptions(useFormParam?: FormNameSubscriptions) {
  return useFormParam instanceof FormNameSubscriptions ? useFormParam : new FormNameSubscriptions();
}

export default createValuesSubscriptions;
