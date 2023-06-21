/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, renderHook } from '@testing-library/react';
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
    const subscriptions = new FormNameSubscriptions();
    const useFormHook = renderHook(() =>
      useForm({ $instance: { valuesSubscriptions: subscriptions } }),
    );
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    expect(subscriptions.isInitialized('test')).toBe(true);
  });

  test('should bind a form field to the component', () => {
    const subscriptions = new FormNameSubscriptions();
    const useFormHook = renderHook(() =>
      useForm({ $instance: { valuesSubscriptions: subscriptions } }),
    );
    renderHook(() => useBind({ name: 'test', form: useFormHook.result.current }));

    console.log(
      "(subscriptions.getSubscription('test').getSubscribers()",
      subscriptions.getSubscription('test').getSubscribers(),
    );

    expect(subscriptions.isInitialized('test')).toBe(true);
    expect(subscriptions.getSubscription('test').getSubscribers().size).toBe(1);
  });

  test('should update the component when the form field value changes', () => {
    const value = 'input value';
    const Component = () => {
      const form = useForm();
      const bind = useBind({ name: 'name', form });
      return (
        <form>
          <input value={bind.value} onChange={(e) => bind.setValue(e.target.value)} />
        </form>
      );
    };
    const { getByRole } = render(<Component />);
    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value } });

    // @ts-expect-error
    expect(input.value).toBe(value);
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

  test('should set the aria-invalid attribute to a binded input when the FormName has errors', () => {
    const Component = () => {
      const form = useForm();
      const bind = useBind({ name: 'name', form, options: { required: true } });
      const onSubmit = form.submit(() => { });
      return (
        <form onSubmit={onSubmit}>
          <input
            value={bind.value}
            onChange={(e) => bind.setValue(e.target.value)}
            ref={bind.ref}
          />
          <button type='submit'>Submit</button>
        </form>
      );
    };
    const { getByRole } = render(<Component />);
    const updateButton = getByRole('button');
    const input = getByRole('textbox');
    fireEvent.click(updateButton);

    expect(input.ariaInvalid).toBe('true');
  });
});
