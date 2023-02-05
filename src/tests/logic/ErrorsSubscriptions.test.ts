import { test, expect, vi } from 'vitest';
import { FormErrors } from '../..';
import ErrorsSubscriptions from '../../logic/ErrorsSubscriptions';

test('publish should call all subscribers with the errors object', () => {
  const subscriptions = new ErrorsSubscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const errors: FormErrors = {
    username: {
      name: 'username',
      type: 'required',
    },
  };
  subscriptions.publish(errors);
  expect(mockSubscriber).toHaveBeenCalledWith(errors);
});
