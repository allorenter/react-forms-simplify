import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';
import useFormFieldWatch from './useValue';
import useForm from './useForm';

describe('useFormFieldWatch tests', () => {
  test('should return null if the FormField to which we subscribe has not been initialized', async () => {
    const form = renderHook(() => useForm());
    const { result } = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return undefined if the FormField is initialized but has not publish a value yet', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const { result } = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );

    expect(result.current).toBe(undefined);
  });

  test('should return the value if the FormField is initialized and publish a value', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const { result, rerender } = renderHook(() =>
      useFormFieldWatch({
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

  test('should not create a new subscription if other FormField is subscribed ', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const hookName = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    subscriptions.initFormFieldSubscription('cod');
    renderHook(() =>
      useFormFieldWatch({
        name: 'cod',
        form: form.result.current,
      }),
    );
    hookName.rerender({ formFieldsSubscriptions: subscriptions });
    const nameSubscribers = subscriptions.getFormFieldSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(1);
  });

  test('should be two subscribers in the FormFieldSubscription if there are two hooks subscribed to the same name', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const firstHook = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    firstHook.rerender();
    secondHook.rerender();
    const nameSubscribers = subscriptions.getFormFieldSubscription('name').getSubscribers();

    expect(nameSubscribers.size).toBe(2);
  });

  test('should have the same value if two hooks are subscribed to the same name', async () => {
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const firstHook = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const secondHook = renderHook(() =>
      useFormFieldWatch({
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
    const subscriptions = new FormFieldsSubscriptions();
    subscriptions.initFormFieldSubscription('name');
    const form = renderHook(() => useForm({ formFieldsSubscriptions: subscriptions }));
    const { unmount } = renderHook(() =>
      useFormFieldWatch({
        name: 'name',
        form: form.result.current,
      }),
    );
    const nameSubscription = subscriptions.getFormFieldSubscription('name');

    expect(nameSubscription.getSubscribers().size).toBe(1);

    unmount();

    expect(nameSubscription.getSubscribers().size).toBe(0);
  });
});
