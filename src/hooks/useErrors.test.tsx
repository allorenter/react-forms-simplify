import ErrorsSubscriptions from '@/logic/ErrorsSubscriptions';
import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useErrors } from '..';

describe('useErrors', () => {
  test('should return hasErrors = true if the form has errors', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('name', {
      validation: { required: true },
    });
    const errorHook = renderHook(() => useErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit((values) => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.hasErrors).toBe(true);
  });

  test('should return the error type and the formFieldName if the form has errors', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('phone', {
      validation: { required: true },
    });
    const errorHook = renderHook(() => useErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit((values) => {
      return new Promise((resolve) => resolve('submit'));
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.errors).toEqual({ phone: { name: 'phone', type: 'required' } });
  });

  test('should return empty errors if the form has no errors', () => {
    const hookForm = renderHook(() => useForm());
    const bind = hookForm.result.current.bind('phone', {
      validation: { required: true },
    });
    bind.onChange({ target: { value: '675654321' } });
    const errorHook = renderHook(() => useErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.submit((values) => {
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
    const formFieldErrorsSubscriptions = new ErrorsSubscriptions();
    const hookForm = renderHook(() =>
      useForm({ $instance: { formFieldsErrorsSubscriptions: formFieldErrorsSubscriptions } }),
    );
    const errorsHook = renderHook(() => useErrors({ form: hookForm.result.current }));

    expect(formFieldErrorsSubscriptions.getSubscribers().size).toBe(1);

    errorsHook.unmount();

    expect(formFieldErrorsSubscriptions.getSubscribers().size).toEqual(0);
  });
});
