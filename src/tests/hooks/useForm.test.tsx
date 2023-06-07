import { describe, test, expect } from 'vitest';
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import useForm from '../../hooks/useForm';
import ValuesSubscriptions from '@/logic/ValuesSubscriptions';

describe('useForm tests', () => {
  test('should return an empty object if getValues is called initially', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue()).toEqual({});
  });

  test('should return undefined if getValue is called with a name that has not been in the values', async () => {
    const { result } = renderHook(() => useForm());

    expect(result.current.getValue('name')).toEqual(undefined);
  });

  test('should not set a Value when the name has not been bind', async () => {
    const { result } = renderHook(() => useForm());
    const value = 'test value';
    result.current.setValue('name', value);

    expect(result.current.getValue('name')).toEqual(undefined);
  });

  test('should add a name to Value when call bind', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const formControl = result.current.bind('name');
    const fieldValue = 'value for the simulated field';
    const eventMock = {
      target: {
        value: fieldValue,
      },
    };
    formControl.onChange(eventMock);

    expect(result.current.getValue('name')).toBe(fieldValue);
  });

  test('should add a name to Value when call bindNumber', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const formControl = result.current.bindNumber('number');
    const fieldValue = 9;
    const eventMock = {
      target: {
        value: fieldValue.toString(),
      },
    };
    formControl.onChange(eventMock);

    expect(result.current.getValue('number')).toBe(fieldValue);
  });

  test('should add a name to Value when call bindCheckbox', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const formControl = result.current.bindCheckbox('name', 'A');
    const fieldValue = 'A';
    const eventMock = {
      target: {
        value: fieldValue,
        checked: true,
      },
    };
    formControl.onChange(eventMock);

    expect(result.current.getValue('name')).toStrictEqual([fieldValue]);
  });

  test('should add a name to Value when call bindRadio', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const formControl = result.current.bindRadio('name', 'A');
    const fieldValue = 'A';
    const eventMock = {
      target: {
        value: fieldValue,
      },
    };
    formControl.onChange(eventMock);

    expect(result.current.getValue('name')).toBe(fieldValue);
  });

  test('should change the Value when change on other radio with the same name', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const formControlA = result.current.bindRadio('name', 'A');
    const formControlB = result.current.bindRadio('name', 'B');
    const fieldValueA = 'A';
    const fieldValueB = 'B';
    formControlA.onChange({
      target: {
        value: fieldValueA,
      },
    });

    expect(result.current.getValue('name')).toBe(fieldValueA);

    formControlB.onChange({
      target: {
        value: fieldValueB,
      },
    });

    expect(result.current.getValue('name')).toBe(fieldValueB);
  });

  test('should add a ValuesSubscription when call bind', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    result.current.bind('name');

    expect(valuesSubscriptions.valueIsInitialized('name')).toBe(true);
  });

  test('should set value when called setValue and the name is binded', async () => {
    const { result, rerender } = renderHook(() => useForm());
    const value = 'value for test';
    const formControl = result.current.bind('name');
    const eventMock = {
      target: { value: 'a' },
    };
    formControl.onChange(eventMock);
    rerender();
    result.current.setValue('name', value);

    expect(result.current.getValue('name')).toBe(value);
  });

  test('should notify to subscribers when onChange is called', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const value = 'value for test';
    const formControl = result.current.bind('name');
    formControl.onChange({
      target: { value: 'a' },
    });
    let mockActionValue;
    valuesSubscriptions.subscribe('name', (val: any) => {
      mockActionValue = val;
    });
    formControl.onChange({
      target: { value },
    });

    expect(mockActionValue).toBe(value);
  });

  test('should change the input value when the onChange is called', async () => {
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
          <input
            {...form.bind('test')}
            defaultValue={defaultValue}
          />
        </>
      );
    };
    const { getByRole } = render(<Component />);
    const updateButton = getByRole('button');
    const input = getByRole('textbox');
    fireEvent.click(updateButton);

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(input.value).toBe(value);
    });
  });

  test('should notify to subscribers when onChange is called', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const value = 'value for test';
    result.current.bind('name');
    let mockActionValue;
    valuesSubscriptions.subscribe('name', (val: any) => {
      mockActionValue = val;
    });
    result.current.setValue('name', value);

    expect(mockActionValue).toBe(value);
  });

  test('should set the initial Values when called reset', async () => {
    const { result } = renderHook(() => useForm());
    const values = {
      test1: 'value for test1',
      test2: 'value for test2',
    };
    result.current.reset(values);

    expect(result.current.getValue()).toEqual(values);
  });

  test('should reset the current values when called reset', async () => {
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

  test('should notify to subscribers when reset is called', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const { result } = renderHook(() => useForm({ $instance: { valuesSubscriptions } }));
    const valueForTest1 = 'value for test 1';
    const valueForTest2 = 'value for test 2';
    result.current.bind('test1');
    result.current.bind('test2');
    let mockActionValueTest1, mockActionValueTest2;
    valuesSubscriptions.subscribe('test1', (val: any) => {
      mockActionValueTest1 = val;
    });
    valuesSubscriptions.subscribe('test2', (val: any) => {
      mockActionValueTest2 = val;
    });
    result.current.reset({
      test1: valueForTest1,
      test2: valueForTest2,
    });

    expect(mockActionValueTest1).toBe(valueForTest1);
    expect(mockActionValueTest2).toBe(valueForTest2);
  });

  test('should add only one subscription when called bindFormControl even if the componet is rerendered', async () => {
    const valuesSubscriptions = new ValuesSubscriptions();
    const Component = () => {
      const form = useForm({ $instance: { valuesSubscriptions } });

      return <input {...form.bind('name')} />;
    };
    const { rerender } = render(<Component />);
    rerender(<Component />);

    expect(valuesSubscriptions.getValueSubscription('name').getSubscribers().size).toBe(1);
  });

  test('should change the inputs values when reset is called', async () => {
    const updatedValue = 'updatedValue';
    const Component = () => {
      const form = useForm();
      const onClick = () => {
        form.reset({ test: updatedValue });
      };
      return (
        <>
          <button onClick={onClick}>Set value</button>
          <input {...form.bind('test')} />
        </>
      );
    };
    const { getByRole } = render(<Component />);
    const updateButton = getByRole('button');
    const input = getByRole('textbox');
    fireEvent.click(updateButton);

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(input.value).toBe(updatedValue);
    });
  });

  test('should change the inputs values when reset is called', async () => {
    const updatedValue = 'updatedValue';
    const Component = () => {
      const form = useForm();
      const onClick = () => {
        form.reset({ test: updatedValue });
      };
      return (
        <>
          <button onClick={onClick}>Set value</button>
          <input {...form.bind('test')} />
        </>
      );
    };
    const { getByRole } = render(<Component />);
    const updateButton = getByRole('button');
    const input = getByRole('textbox');
    fireEvent.click(updateButton);

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      expect(input.value).toBe(updatedValue);
    });
  });
});
