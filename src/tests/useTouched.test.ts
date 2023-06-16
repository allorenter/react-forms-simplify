import TouchedSubscriptions from '@/logic/TouchedSubscriptions';
import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useTouched } from '@/index';

describe('useTouched hook tests', () => {
  test('should return empty array if no value is touched', () => {
    const hookForm = renderHook(() => useForm());
    hookForm.result.current.bind('name', {
      required: true,
    });
    const touchedHook = renderHook(() => useTouched({ form: hookForm.result.current }));
    hookForm.rerender();
    touchedHook.rerender();

    expect(touchedHook.result.current).toEqual([]);
  });

  test('should return the name of the touched values', () => {
    const hookForm = renderHook(() => useForm());
    const formControl = hookForm.result.current.bind('name');
    const touchedHook = renderHook(() => useTouched({ form: hookForm.result.current }));
    formControl.onChange({
      target: { value: 'a' },
    });
    hookForm.rerender();
    touchedHook.rerender();

    expect(touchedHook.result.current).toEqual(['name']);
  });

  test('should unsubscribe when the hook unmount', () => {
    const touchedFieldsSubscriptions = new TouchedSubscriptions();
    const hookForm = renderHook(() =>
      useForm({ $instance: { touchedSubscriptions: touchedFieldsSubscriptions } }),
    );
    const touchedHook = renderHook(() => useTouched({ form: hookForm.result.current }));

    expect(touchedFieldsSubscriptions.getSubscribers().size).toBe(1);

    touchedHook.unmount();

    expect(touchedFieldsSubscriptions.getSubscribers().size).toEqual(0);
  });

  test('should return the name of the touched values for nested names', () => {
    const hookForm = renderHook(() => useForm());
    const formControl = hookForm.result.current.bind('name.nest');
    const touchedHook = renderHook(() => useTouched({ form: hookForm.result.current }));
    formControl.onChange({
      target: { value: 'a' },
    });
    hookForm.rerender();
    touchedHook.rerender();

    expect(touchedHook.result.current).toEqual(['name.nest']);
    expect(hookForm.result.current.getValue('name.nest')).toBe('a');
  });
});
