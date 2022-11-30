import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';
import useFormValueWatch from './useFormValuewatch';

describe('useFormValueWatch tests', () => {
  test('should return null if the FormValue to which we subscribe has not been initialized', async () => {
    const subscriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return undefined if the FormValue is initialized but has not publish a value yet', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const { result } = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return the value if the FormValue is initialized and publish a value', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const { result, rerender } = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );

    expect(result.current).toBe(undefined);

    const publishedValue = 'value for test';
    subscriptions.publish('name', publishedValue);
    rerender();

    expect(result.current).toBe(publishedValue);
  });

  test('should not create a new subscription if other FormValue is subscribed ', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const hookName = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );
    subscriptions.initFormValueSubscription('cod');
    renderHook(() =>
      useFormValueWatch({
        name: 'cod',
        formValuesSubscriptions: subscriptions,
      }),
    );
    hookName.rerender({ formValuesSubscriptions: subscriptions });
    const nameSubscribers = subscriptions.getFormValueSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(1);
  });

  test('should be two subscribers in the FormValueSubscription if there are two hooks subscribed to the same name', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const firstHook = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );
    const secondHook = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );
    firstHook.rerender();
    secondHook.rerender();
    const nameSubscribers = subscriptions.getFormValueSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(2);
  });

  test('should have the same value if two hooks are subscribed to the same name', async () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const firstHook = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );
    const secondHook = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );

    expect(firstHook.result.current).toBe(undefined);
    expect(secondHook.result.current).toBe(undefined);

    const publishedValue = 'value for test';
    subscriptions.publish('name', publishedValue);
    firstHook.rerender();
    secondHook.rerender();

    expect(firstHook.result.current).toBe(publishedValue);
    expect(secondHook.result.current).toBe(publishedValue);
  });

  test('should remove the subscription if the hook unmount', () => {
    const subscriptions = new FormValuesSubscriptions();
    subscriptions.initFormValueSubscription('name');
    const { unmount } = renderHook(() =>
      useFormValueWatch({
        name: 'name',
        formValuesSubscriptions: subscriptions,
      }),
    );
    const nameSubscription = subscriptions.getFormValueSubscription('name');

    expect(nameSubscription.getSubscribers().size).toBe(1);

    unmount();

    expect(nameSubscription.getSubscribers().size).toBe(0);
  });
});
