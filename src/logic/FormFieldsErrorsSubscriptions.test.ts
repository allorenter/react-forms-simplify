import { test, expect, vi } from 'vitest';
import { FormFieldsErrors } from '..';
import FormFieldsErrorsSubscriptions from './FormFieldsErrorsSubscriptions';

test('publish should call all subscribers with the errors object', () => {
  const subscriptions = new FormFieldsErrorsSubscriptions();
  const mockSubscriber = vi.fn();
  subscriptions.subscribe(mockSubscriber);
  const errors: FormFieldsErrors = {
    username: {
      name: 'username',
      type: 'required',
    },
  };
  subscriptions.publish(errors);
  expect(mockSubscriber).toHaveBeenCalledWith(errors);
});
