import { describe, test, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import FormNameSubscriptions from '@/logic/FormNameSubscriptions';
import useValue from '@/hooks/useValue';
import useForm from '@/hooks/useForm';

const timeout = (ms = 300) => new Promise((resolve) => setTimeout(() => resolve(null), ms));

describe('useValue hook tests', () => {
  test('should return null if the FormName to which we subscribe has not been initialized', async () => {
    const form = renderHook(() => useForm());
    const { result } = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return undefined if the FormName is initialized but has not publish a value yet', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { result } = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return the value if the FormName is initialized and publish a value', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { result, rerender } = renderHook(() =>
      useValue({
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

  test('should not create a new subscription if other FormName is subscribed ', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const hookName = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );
    subscriptions.initSubscription('cod');
    renderHook(() =>
      useValue({
        name: 'cod',
        form: form.result.current,
      }),
    );
    hookName.rerender({ valuesSubscriptions: subscriptions });
    const nameSubscribers = subscriptions.getSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(1);
  });

  test('should be two subscribers in the valuesSubscriptions if there are two hooks subscribed to the same FormName', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const firstHook = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );
    firstHook.rerender();
    secondHook.rerender();
    const nameSubscribers = subscriptions.getSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(2);
  });

  test('should have the same value if two hooks are subscribed to the same FormName', async () => {
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const firstHook = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useValue({
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
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() => useForm({ $instance: { valuesSubscriptions: subscriptions } }));
    const { unmount } = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );
    const nameSubscription = subscriptions.getSubscription('name');

    expect(nameSubscription.getSubscribers().size).toBe(1);

    unmount();

    expect(nameSubscription.getSubscribers().size).toBe(0);
  });

  test('should return the value if the FormName is initialized with defaultValues', async () => {
    const initialValue = 'initial value';
    const subscriptions = new FormNameSubscriptions();
    subscriptions.initSubscription('name');
    const form = renderHook(() =>
      useForm({
        $instance: { valuesSubscriptions: subscriptions },
        defaultValues: { name: initialValue },
      }),
    );
    const { result, rerender } = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );

    rerender();

    expect(result.current).toBe(initialValue);
  });

  test('should return the value if the FormName is initialized with defaultValues and the hook useValue is mount after useForm', async () => {
    const initialValue = 'initial value';
    const changedValue = 'changed value';
    const form = renderHook(() =>
      useForm({
        defaultValues: { name: initialValue },
      }),
    );
    form.result.current.bind('name');
    form.result.current.setValue('name', changedValue);
    await timeout(300);
    const { result } = renderHook(() =>
      useValue({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(changedValue);
  });

  test('should return the value of all FormNames when not receive the name parameter', async () => {
    const defaultValues = { name: 'Initial name', numeric: 10 };
    const form = renderHook(() => useForm({ defaultValues }));
    const valuesHook = renderHook(() => useValue({ form: form.result.current }));

    waitFor(() => {
      expect(valuesHook.result.current).toEqual(defaultValues);
    });
  });
});
