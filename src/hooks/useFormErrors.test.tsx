import FormFieldsErrorsSubscriptions from '@/logic/FormFieldsErrorsSubscriptions';
import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useFormErrors } from '..';

describe('useFormErrors', () => {
  test('should return hasErrors = true if the form has errors', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bindFormField('name', {
      validation: { required: true },
    });
    const errorHook = renderHook(() => useFormErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.handleSubmit((values) => {
      return new Promise((resolve) => resolve('submit'));
    });
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.hasErrors).toBe(true);
  });

  test('should return the error type and the formFieldName if the form has errors', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bindFormField('phone', {
      validation: { required: true },
    });
    const errorHook = renderHook(() => useFormErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.handleSubmit((values) => {
      return new Promise((resolve) => resolve('submit'));
    });
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.errors).toEqual({ phone: { name: 'phone', type: 'required' } });
  });

  test('should return empty errors if the form has no errors', () => {
    const hookForm = renderHook(() => useForm());
    const bind = hookForm.result.current.bindFormField('phone', {
      validation: { required: true },
    });
    bind.onChange({ target: { value: '675654321' } });
    const errorHook = renderHook(() => useFormErrors({ form: hookForm.result.current }));
    const submit = hookForm.result.current.handleSubmit((values) => {
      return new Promise((resolve) => resolve('submit'));
    });
    submit({ preventDefault: () => { } });
    hookForm.rerender();
    errorHook.rerender();

    expect(errorHook.result.current.errors).toEqual({});
  });

  test('should unsuscribe when the hook unmount', () => {
    const formFieldErrorsSubcriptions = new FormFieldsErrorsSubscriptions();
    const hookForm = renderHook(() =>
      useForm({ formFieldsErrorsSubcriptions: formFieldErrorsSubcriptions }),
    );
    const errorsHook = renderHook(() => useFormErrors({ form: hookForm.result.current }));

    expect(formFieldErrorsSubcriptions.getSubscribers().size).toBe(1);

    errorsHook.unmount();

    expect(formFieldErrorsSubcriptions.getSubscribers().size).toEqual(0);
  });
});
