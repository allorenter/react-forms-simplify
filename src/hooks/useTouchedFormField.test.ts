import FormFieldsTouchedSubscriptions from '@/logic/FormFieldsTouchedSubscriptions';
import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useTouchedFormFields } from '..';

describe('useFormErrors', () => {
  test('should return empty array if no formField is touched', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bindFormField('name', {
      validation: { required: true },
    });
    const touchedHook = renderHook(() => useTouchedFormFields({ form: hookForm.result.current }));
    hookForm.rerender();
    touchedHook.rerender();

    expect(touchedHook.result.current).toEqual([]);
  });

  test('should return the name of the touched formFields', () => {
    const hookForm = renderHook(() => useForm());
    const formControl = hookForm.result.current.bindFormField('name');
    const touchedHook = renderHook(() => useTouchedFormFields({ form: hookForm.result.current }));
    formControl.onChange({
      target: { value: 'a' },
    });
    hookForm.rerender();
    touchedHook.rerender();

    expect(touchedHook.result.current).toEqual(['name']);
  });

  test('should unsuscribe when the hook unmount', () => {
    const touchedFieldsSubcriptions = new FormFieldsTouchedSubscriptions();
    const hookForm = renderHook(() =>
      useForm({ formFieldsTouchedSubscriptions: touchedFieldsSubcriptions }),
    );
    const touchedHook = renderHook(() => useTouchedFormFields({ form: hookForm.result.current }));

    expect(touchedFieldsSubcriptions.getSubscribers().size).toBe(1);

    touchedHook.unmount();

    expect(touchedFieldsSubcriptions.getSubscribers().size).toEqual(0);
  });
});