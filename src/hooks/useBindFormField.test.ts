import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useForm from './useForm';
import useBindFormField from './useBindFormField';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';

describe('useBindFormField tests', () => {
  test('should add a name to FormField when the hook is called initially', async () => {
    const useFormHook = renderHook(() => useForm());
    renderHook(() => useBindFormField({ name: 'test', form: useFormHook.result.current }));

    expect(useFormHook.result.current.getValue()).toEqual({ test: '' });
  });

  test('should add a FormFieldsSubscription when the hook is called initially', async () => {
    const subcriptions = new FormFieldsSubscriptions();
    const useFormHook = renderHook(() => useForm({ formFieldsSubscriptions: subcriptions }));
    renderHook(() => useBindFormField({ name: 'test', form: useFormHook.result.current }));

    expect(subcriptions.formFieldIsInitialized('test')).toBe(true);
  });

  test('should bind a form field to the component', () => {
    const form = {
      formFieldsSubscriptions: {
        initFormFieldSubscription: vi.fn(),
        subscribe: vi.fn(() => vi.fn()),
      },
      setValue: vi.fn(),
      initFormField: vi.fn(),
    };
    const { result } = renderHook(() => useBindFormField({ name: 'username', form }));
    expect(result.current.value).toEqual('');
    expect(typeof result.current.setFormFieldValue).toBe('function');
    expect(form.formFieldsSubscriptions.initFormFieldSubscription).toHaveBeenCalledWith('username');
    expect(form.initFormField).toHaveBeenCalledWith('username');
  });

  test('should update the component when the form field value changes', () => {
    const form = {
      formFieldsSubscriptions: {
        initFormFieldSubscription: vi.fn(),
        subscribe: vi.fn((name, callback) => {
          callback('new value');
          return vi.fn();
        }),
      },
      setValue: vi.fn(),
      initFormField: vi.fn(),
    };
    const { result } = renderHook(() => useBindFormField({ name: 'username', form }));
    expect(result.current.value).toEqual('new value');
    expect(typeof result.current.setFormFieldValue).toBe('function');
  });

  test('should update the form field value when setFormFieldValue is called', () => {
    const form = {
      formFieldsSubscriptions: {
        initFormFieldSubscription: vi.fn(),
        subscribe: vi.fn(() => vi.fn()),
      },
      setValue: vi.fn(),
      initFormField: vi.fn(),
    };
    const { result } = renderHook(() => useBindFormField({ name: 'username', form }));
    result.current.setFormFieldValue('new value');
    expect(form.setValue).toHaveBeenCalledWith('username', 'new value');
  });
});
