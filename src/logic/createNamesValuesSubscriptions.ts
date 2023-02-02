import NamesValuesSubscriptions from './NamesValuesSubscriptions';

function createNamesValuesSubscriptions(useFormParam?: NamesValuesSubscriptions) {
  return useFormParam instanceof NamesValuesSubscriptions
    ? useFormParam
    : new NamesValuesSubscriptions();
}

export default createNamesValuesSubscriptions;
