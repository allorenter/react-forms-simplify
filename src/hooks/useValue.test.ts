import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import ValuesSubscriptions from '@/logic/ValuesSubscriptions';
import useValueWatch from './useValue';
import useForm from './useForm';

describe('useValueWatch tests', () => {
  test('should return null if the Value to which we subscribe has not been initialized', async () => {
    const form = renderHook(() => useForm());
    const { result } = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return undefined if the Value is initialized but has not publish a value yet', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { result } = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return the value if the Value is initialized and publish a value', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { result, rerender } = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);

    const publishedValue = 'value for test';
    subscriptions.publish('name', publishedValue);
    rerender();

    expect(result.current).toBe(publishedValue);
  });

  test('should not create a new subscription if other Value is subscribed ', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const hookName = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    subscriptions.initValueSubscription('cod');
    renderHook(() =>
      useValueWatch({
        name: 'cod',
        form: form.result.current,
      }),
    );
    hookName.rerender({ valuesSubscriptions: subscriptions });
    const nameSubscribers = subscriptions.getValueSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(1);
  });

  test('should be two subscribers in the ValueSubscription if there are two hooks subscribed to the same name', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const firstHook = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    firstHook.rerender();
    secondHook.rerender();
    const nameSubscribers = subscriptions.getValueSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(2);
  });

  test('should have the same value if two hooks are subscribed to the same name', async () => {
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const firstHook = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
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
    const subscriptions = new ValuesSubscriptions();
    subscriptions.initValueSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { unmount } = renderHook(() =>
      useValueWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const nameSubscription = subscriptions.getValueSubscription('name');

    expect(nameSubscription.getSubscribers().size).toBe(1);

    unmount();

    expect(nameSubscription.getSubscribers().size).toBe(0);
  });
});
