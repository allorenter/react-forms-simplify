import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useForm from './useForm';
import useBind from './useBind';
import FormFieldsSubscriptions from '@/logic/FormFieldsSubscriptions';

describe('useBind tests', () => {
  test('should add a name to FormField when the hook is called initially', async () => {
    const useFormHook = renderHook(() => useForm());
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    expect(useFormHook.result.current.getValue()).toEqual({ test: '' });
  });

  test('should add a FormFieldsSubscription when the hook is called initially', async () => {
    const Subscriptions = new FormFieldsSubscriptions();
    const useFormHook = renderHook(() =>
      useForm({ $instance: { formFieldsSubscriptions: Subscriptions } }),
    );
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    expect(Subscriptions.formFieldIsInitialized('test')).toBe(true);
  });

  test('should bind a form field to the component', () => {
    const form = {
      $instance: {
        formFieldsSubscriptions: {
          initFormFieldSubscription: vi.fn(),
          subscribe: vi.fn(() => vi.fn()),
        },
        initFormField: vi.fn(),
        getFormFieldRef: vi.fn(),
        initFormFieldValidation: vi.fn(),
        setFormFieldRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    expect(result.current.value).toEqual('');
    expect(typeof result.current.setFormFieldValue).toBe('function');
    expect(form.$instance.formFieldsSubscriptions.initFormFieldSubscription).toHaveBeenCalledWith(
      'username',
    );
    expect(form.$instance.initFormField).toHaveBeenCalledWith('username');
  });

  test('should update the component when the form field value changes', () => {
    const form = {
      $instance: {
        formFieldsSubscriptions: {
          initFormFieldSubscription: vi.fn(),
          subscribe: vi.fn((name, callback) => {
            callback('new value');
            return vi.fn();
          }),
        },
        initFormField: vi.fn(),
        getFormFieldRef: vi.fn(),
        initFormFieldValidation: vi.fn(),
        setFormFieldRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    expect(result.current.value).toEqual('new value');
    expect(typeof result.current.setFormFieldValue).toBe('function');
  });

  test('should update the form field value when setFormFieldValue is called', () => {
    const form = {
      $instance: {
        formFieldsSubscriptions: {
          initFormFieldSubscription: vi.fn(),
          subscribe: vi.fn(() => vi.fn()),
        },
        initFormField: vi.fn(),
        getFormFieldRef: vi.fn(),
        initFormFieldValidation: vi.fn(),
        setFormFieldRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    result.current.setFormFieldValue('new value');
    expect(form.setValue).toHaveBeenCalledWith('username', 'new value');
  });
});