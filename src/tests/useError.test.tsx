import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useError } from '@/index';
import FormNameSubscriptions from '@/logic/FormNameSubscriptions';

describe('useError hook tests', () => {
  test('should return hasErrors = true if the form has errors when not receive the name parameter', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('name', {
      required: true,
    });
    const errorHook = renderHook(() => useError({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit(() => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.hasErrors).toBe(true);
  });

  test('should return the error type and the valueName if the form has errors', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('phone', {
      required: true,
    });
    const errorHook = renderHook(() => useError({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit(() => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.errors).toEqual({ phone: { name: 'phone', type: 'required' } });
  });

  test('should return empty errors if the form has no errors and not receive the name param', () => {
    const hookForm = renderHook(() => useForm());
    const bind = hookForm.result.current.bind('phone', {
      required: true,
    });
    bind.onChange({ target: { value: '675654321' } });
    const errorHook = renderHook(() => useError({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit(() => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.errors).toEqual({});
  });

  test('should unsubscribe when the hook unmount', () => {
    const errorsSubscriptions = new FormNameSubscriptions();
    const hookForm = renderHook(() => useForm({ $instance: { errorsSubscriptions } }));
    hookForm.result.current.bind('name');
    const errorsHook = renderHook(() => useError({ form: hookForm.result.current }));

    expect(errorsSubscriptions.getSubscription('name').getSubscribers().size).toBe(1);

    errorsHook.unmount();

    expect(errorsSubscriptions.getSubscription('name').getSubscribers().size).toEqual(0);
  });

  test('should return undefined if the form has no errors when receive the name param', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('name');
    const errorsHook = renderHook(() => useError({ name: 'name', form: hookForm.result.current }));

    expect(errorsHook.result.current).toBe(undefined);
  });

  test('should return the error of one FormName when receive the name param', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('name', { required: true });
    const errorsHook = renderHook(() => useError({ name: 'name', form: hookForm.result.current }));
    const submit = hookForm.result.current.submit(() => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorsHook.rerender();

    expect(errorsHook.result.current).toEqual({ name: 'name', type: 'required' });
  });
});
