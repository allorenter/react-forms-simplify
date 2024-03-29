import FormNameSubscriptions from '@/logic/FormNameSubscriptions';
import validateValue from '@/logic/validateValue';
import { describe, test, expect, vi } from 'vitest';

describe('validateValue tests', () => {
  test('should return undefined if the validation param is falsy', async () => {
    const subscriptions = new FormNameSubscriptions();

    expect(validateValue(undefined, 'test', '', {}, subscriptions)).toBeUndefined();
  });

  test('should set the error if the value is an empty string, null, undefined or NaN and the validation is required', async () => {
    const subscriptions = new FormNameSubscriptions();
    const errors = {
      test: undefined,
    };
    validateValue({ required: true }, 'test', '', errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'required',
    });

    validateValue({ required: true }, 'test', 'f', errors, subscriptions);

    expect(errors.test).toBe(undefined);

    validateValue({ required: true }, 'test', null, errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'required',
    });

    validateValue({ required: true }, 'test', undefined, errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'required',
    });

    validateValue({ required: true }, 'test', NaN, errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'required',
    });
  });

  test('should set the error if the value is invalid(empty string, null, undefined or NaN) and the validationFunction returns truthy', async () => {
    const subscriptions = new FormNameSubscriptions();
    const errors = {
      test: undefined,
    };
    const invalidate = () => {
      return true;
    };
    validateValue({ invalidate }, 'test', '', errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'invalidate',
    });
  });

  test('should set the error with the message if the value is invalid(empty string, null, undefined or NaN) and the validationFunction returns a string', async () => {
    const subscriptions = new FormNameSubscriptions();
    const errors = {
      test: undefined,
    };
    const errorMessage = 'the value is invalid';
    const invalidate = () => {
      return errorMessage;
    };
    validateValue({ invalidate }, 'test', '', errors, subscriptions);

    expect(errors.test).toEqual({
      name: 'test',
      type: 'invalidate',
      message: errorMessage,
    });
  });

  test('should notify all subscribers with the errors object', async () => {
    const subscriptions = new FormNameSubscriptions();
    const mockSubscriber = vi.fn();
    subscriptions.initSubscription('test');
    subscriptions.subscribeAll(mockSubscriber);
    const errors = {
      test: undefined,
    };
    const errorMessage = 'the value is invalid';
    const invalidate = () => {
      return errorMessage;
    };
    validateValue({ invalidate }, 'test', '', errors, subscriptions);

    expect(mockSubscriber).toBeCalled();
  });
});
