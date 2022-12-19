import { test, expect, vi } from 'vitest';
import { TouchedFormFields } from '..';
import FormFieldsTouchedSubscriptions from './FormFieldsTouchedSubscriptions';

test('publish should call all subscribers with the touched form fields object', () => {
  const subscriptions = new FormFieldsTouchedSubscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const touched: TouchedFormFields = {
    username: true,
  };
  subscriptions.publish(touched);
  expect(mockSubscriber).toHaveBeenCalledWith(touched);
});
