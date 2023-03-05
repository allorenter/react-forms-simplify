import ValuesSubscriptions from './ValuesSubscriptions';

function createValuesSubscriptions(useFormParam?: ValuesSubscriptions) {
  return useFormParam instanceof ValuesSubscriptions ? useFormParam : new ValuesSubscriptions();
}

export default createValuesSubscriptions;
