import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useForm from '@/hooks/useForm';
import useBind from '@/hooks/useBind';
import FormNameSubscriptions from '@/logic/FormNameSubscriptions';

describe('useBind hook tests', () => {
  test('should add a value when the hook is called initially', async () => {
    const useFormHook = renderHook(() => useForm());
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    expect(useFormHook.result.current.getValue()).toEqual({ test: '' });
  });

  test('should add a ValuesSubscription when the hook is called initially', async () => {
    const Subscriptions = new FormNameSubscriptions();
    const useFormHook = renderHook(() =>
      useForm({ $instance: { valuesSubscriptions: Subscriptions } }),
    );
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    expect(Subscriptions.isInitialized('test')).toBe(true);
  });

  test('should bind a form field to the component', () => {
    const form = {
      $instance: {
        valuesSubscriptions: {
          initSubscription: vi.fn(),
          subscribe: vi.fn(() => vi.fn()),
        },
        initValue: vi.fn(),
        getInputRef: vi.fn(),
        initValueValidation: vi.fn(),
        setInputRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    expect(result.current.value).toEqual('');
    expect(typeof result.current.setValue).toBe('function');
    expect(form.$instance.valuesSubscriptions.initSubscription).toHaveBeenCalledWith('username');
    expect(form.$instance.initValue).toHaveBeenCalledWith('username');
  });

  test('should update the component when the form field value changes', () => {
    const form = {
      $instance: {
        valuesSubscriptions: {
          initSubscription: vi.fn(),
          subscribe: vi.fn((name, callback) => {
            callback('new value');
            return vi.fn();
          }),
        },
        initValue: vi.fn(),
        getInputRef: vi.fn(),
        initValueValidation: vi.fn(),
        setInputRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    expect(result.current.value).toEqual('new value');
    expect(typeof result.current.setValue).toBe('function');
  });

  test('should update the form field value when setValue is called', () => {
    const form = {
      $instance: {
        valuesSubscriptions: {
          initSubscription: vi.fn(),
          subscribe: vi.fn(() => vi.fn()),
        },
        initValue: vi.fn(),
        getInputRef: vi.fn(),
        initValueValidation: vi.fn(),
        setInputRef: vi.fn(),
      },
      setValue: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { result } = renderHook(() => useBind({ name: 'username', form }));
    result.current.setValue('new value');

    expect(form.setValue).toHaveBeenCalledWith('username', 'new value');
  });

  test('should return the value if the form is initialized with defaultValues', async () => {
    const initialValue = 'initial value';
    const form = renderHook(() =>
      useForm({
        defaultValues: { name: initialValue },
      }),
    );
    const { result, rerender } = renderHook(() =>
      useBind({
        name: 'name',
        form: form.result.current,
      }),
    );

    rerender();

    expect(result.current.value).toBe(initialValue);
  });
});
