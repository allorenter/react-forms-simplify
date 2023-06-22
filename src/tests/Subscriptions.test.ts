import { test, expect, vi } from 'vitest';
import { TouchedValues } from '@/index';
import Subscriptions from '@/logic/Subscriptions';

test('publish should call all subscribers with the touched form fields object', () => {
  const subscriptions = new Subscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const touched: TouchedValues = {
    username: true,
  };
  subscriptions.publish(touched);
  expect(mockSubscriber).toHaveBeenCalledWith(touched);
});
