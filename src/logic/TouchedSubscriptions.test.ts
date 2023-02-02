import { test, expect, vi } from 'vitest';
import { TouchedNamesValues } from '..';
import TouchedSubscriptions from './TouchedSubscriptions';

test('publish should call all subscribers with the touched form fields object', () => {
  const subscriptions = new TouchedSubscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const touched: TouchedNamesValues = {
    username: true,
  };
  subscriptions.publish(touched);
  expect(mockSubscriber).toHaveBeenCalledWith(touched);
});
