import ErrorsSubscriptions from './ErrorsSubscriptions';

function createErrorsSubscriptions(useFormParam?: ErrorsSubscriptions) {
  return useFormParam instanceof ErrorsSubscriptions ? useFormParam : new ErrorsSubscriptions();
}

export default createErrorsSubscriptions;
