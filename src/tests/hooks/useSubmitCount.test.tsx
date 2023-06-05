import { describe, test, expect, vi } from 'vitest';
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react';
import useForm from '../../hooks/useForm';
import useSubmitCount from '@/hooks/useSubmitCount';

describe('useBind tests', () => {
  test('should return the number of submits of a form', async () => {
    const Component = () => {
      const form = useForm();
      const count = useSubmitCount({ form });
      const onSubmit = form.submit((v) => { });
      return (
        <form onSubmit={onSubmit}>
          <div data-testid='count'>{count}</div>
          <input {...form.bind('test')} />
          <button type='submit'>Submit</button>
        </form>
      );
    };
    const { getByRole, getByTestId } = render(<Component />);
    const submitButton = getByRole('button');
    const count = getByTestId('count');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(count.textContent).toBe('1');
    });
  });
});
