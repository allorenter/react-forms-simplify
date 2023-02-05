import FormProvider from '@/providers/FormProvider';
import { render, renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useForm, useFormContext } from '../..';

describe('useFormContext', () => {
  test('should return the form method in the children components', () => {
    const hookForm = renderHook(() => useForm());
    let childrenForm;
    const Children = () => {
      const formInChildren = useFormContext();
      childrenForm = formInChildren;
      return <></>;
    };
    const Parent = () => {
      return (
        <FormProvider form={hookForm.result.current}>
          <Children />
        </FormProvider>
      );
    };
    render(<Parent />);

    expect(childrenForm).toEqual(hookForm.result.current);
  });
});
