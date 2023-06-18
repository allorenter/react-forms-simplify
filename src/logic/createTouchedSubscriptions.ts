import Subscriptions from './Subscriptions';

function createTouchedSubscriptions(useFormParam?: Subscriptions) {
  return useFormParam instanceof Subscriptions ? useFormParam : new Subscriptions();
}

export default createTouchedSubscriptions;
