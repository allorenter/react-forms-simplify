import TouchedSubscriptions from './TouchedSubscriptions';

function createTouchedSubscriptions(useFormParam?: TouchedSubscriptions) {
  return useFormParam instanceof TouchedSubscriptions ? useFormParam : new TouchedSubscriptions();
}

export default createTouchedSubscriptions;
