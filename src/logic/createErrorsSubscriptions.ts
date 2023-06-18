import Subscriptions from './Subscriptions';

function createErrorsSubscriptions(useFormParam?: Subscriptions) {
  return useFormParam instanceof Subscriptions ? useFormParam : new Subscriptions();
}

export default createErrorsSubscriptions;
