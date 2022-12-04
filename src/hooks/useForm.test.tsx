import { describe, test, expect } from 'vitest';
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import useForm from './useForm';
import FormValuesSubscriptions from '@/logic/FormValuesSubscriptions';

describe('useForm tests', () => {
  test('should return an empty object if getValues is called initially', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue()).toEqual({});
  });

  test('should return undefined if getValue is called with a name that has not been in the formValues', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue('name')).toEqual(undefined);
  });

  // test('should return undefined if getValue is called with a name that has not been bind', async () => {
  //   const { result } = renderHook(() => useForm());
  //   // IMPLEMENTARLO

  //   expect(false).toEqual(true);
  // });

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

  test('should set value when called  and the name is binded', async () => {
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

  test('should change the input value when  is called', async () => {
    const defaultValue = 'initial value';
    const value = 'updated value';
    const Component = () => {
      const form = useForm();
      const onClick = () => {
        form.setValue('test', value);
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
      expect(input.value).toBe(value);
    });
  });

  test('should notify to subscribers when  is called', async () => {
    const subcriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() => useForm({ formValuesSubscriptions: subcriptions }));
    const value = 'value for test';
    result.current.bindFormControl('name');
    let mockActionValue;
    subcriptions.subscribe('name', (val: any) => {
      mockActionValue = val;
    });
    result.current.setValue('name', value);

    expect(mockActionValue).toBe(value);
  });

  test('should set the initial formValues when called reset', async () => {
    const { result } = renderHook(() => useForm());
    const values = {
      test1: 'value for test1',
      test2: 'value for test2',
    };
    result.current.reset(values);

    expect(result.current.getValue()).toEqual(values);
  });

  test('should reset the current formValues when called reset', async () => {
    const { result } = renderHook(() => useForm());
    const initialValues = { value: 'value' };
    result.current.reset(initialValues);

    expect(result.current.getValue()).toEqual(initialValues);

    const values = {
      test1: 'value for test1',
      test2: 'value for test2',
    };
    result.current.reset(values);

    expect(result.current.getValue()).toEqual(values);
  });

  test('should change the inputs values when reset is called', async () => { });

  test('should notify to subscribers when reset is called', async () => {
    const subcriptions = new FormValuesSubscriptions();
    const { result } = renderHook(() => useForm({ formValuesSubscriptions: subcriptions }));
    const valueForTest1 = 'value for test 1';
    const valueForTest2 = 'value for test 2';
    result.current.bindFormControl('test1');
    result.current.bindFormControl('test2');
    let mockActionValueTest1, mockActionValueTest2;
    subcriptions.subscribe('test1', (val: any) => {
      mockActionValueTest1 = val;
    });
    subcriptions.subscribe('test2', (val: any) => {
      mockActionValueTest2 = val;
    });
    result.current.reset({
      test1: valueForTest1,
      test2: valueForTest2,
    });

    expect(mockActionValueTest1).toBe(valueForTest1);
    expect(mockActionValueTest2).toBe(valueForTest2);
  });

  //  testear que se notifica cuando se llama al onchange del bindFormControl y cuando se llama a
});
