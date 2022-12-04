import { describe, test, expect } from 'vitest';
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import useForm from './useForm';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';

describe('useForm tests', () => {
  test('should return an empty object if getValues is called initially', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue()).toEqual({});
  });

  test('should return undefined if getValue is called with a name that has not been bind', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue('name')).toEqual(undefined);
  });

  test('should not set a form value when the name has not been bind', async () => {
    const { result } = renderHook(() => useForm());
    const value = 'test value';
    result.current.setValue('name', value);

    expect(result.current.getValue('name')).toEqual(undefined);
  });

  test('should add formValue when call bindFormControl', async () => {
    const subcriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() => useForm({ formValuesSubscriptions: subcriptions }));
    const formControl = result.current.bindFormControl('name');
    const fieldValue = 'value for the simulated field';
    const eventMock = {
      target: {
        value: fieldValue,
      },
    };
    formControl.onChange(eventMock);

    expect(result.current.getValue('name')).toBe(fieldValue);
  });

  test('should add a FormValuesSubscription when call bindFormControl', async () => {
    const subcriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() => useForm({ formValuesSubscriptions: subcriptions }));
    result.current.bindFormControl('name');

    expect(subcriptions.formValueIsInitialized('name')).toBe(true);
  });

  test('should set value when called setValue and the name is binded', async () => {
    const { result, rerender } = renderHook(() => useForm());
    const value = 'value for test';
    const formControl = result.current.bindFormControl('name');
    const eventMock = {
      target: { value: 'a' },
    };
    formControl.onChange(eventMock);
    rerender();
    result.current.setValue('name', value);

    expect(result.current.getValue('name')).toBe(value);
  });

  test('should notify to subscribers when onChange is called', async () => {
    const subcriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() => useForm({ formValuesSubscriptions: subcriptions }));
    const value = 'value for test';
    const formControl = result.current.bindFormControl('name');
    formControl.onChange({
      target: { value: 'a' },
    });
    let mockActionValue;
    subcriptions.subscribe('name', (val: any) => {
      mockActionValue = val;
    });
    formControl.onChange({
      target: { value },
    });

    expect(mockActionValue).toBe(value);
  });

  test('should change the input value when setValue is called', async () => {
    const defaultValue = 'initial value';
    const value = 'updated value';
    let ref = null;
    const Component = () => {
      const form = useForm();
      const onClick = () => {
        form.setValue('test', value);
        ref = form.getInputRef('test');
      };
      return (
        <>
          <button onClick={onClick}>Set value</button>
          <input {...form.bindFormControl('test')} defaultValue={defaultValue} />
        </>
      );
    };
    const { getByRole } = render(<Component />);
    const updateButton = getByRole('button');
    const input = getByRole('textbox');
    fireEvent.click(updateButton);

    await waitFor(() => {
      console.log('ref', ref.current.value);

      expect(ref.current.value).toBe(value);
    });
  });

  //  testear que se notifica cuando se llama al onchange del bindFormControl y cuando se llama a setValue
});
