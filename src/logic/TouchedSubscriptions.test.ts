import { test, expect, vi } from 'vitest';
import { TouchedValues } from '..';
import TouchedSubscriptions from './TouchedSubscriptions';

test('publish should call all subscribers with the touched form fields object', () => {
  const subscriptions = new TouchedSubscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const touched: TouchedValues = {
    username: true,
  };
  subscriptions.publish(touched);
  expect(mockSubscriber).toHaveBeenCalledWith(touched);
});
