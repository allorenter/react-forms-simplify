import { describe, test, expect, vi } from 'vitest';
import useInputElementRefs from '@/hooks/useInputElementRefs';

describe('useInputElementRefs hook tests', () => {
  test('should set and get a ref object', () => {
    const [getRef, setRef] = useInputElementRefs<HTMLInputElement>();
    const inputRef = setRef('input');
    expect(inputRef).toBeDefined();
    expect(getRef('input')).toEqual(inputRef);
  });

  test('should warn when trying to set a ref without a key', () => {
    const [, setRef] = useInputElementRefs<HTMLInputElement>();
    console.warn = vi.fn();
    setRef('');
    expect(console.warn).toHaveBeenCalledWith(`useInputElementRefs: Cannot set ref without key `);
  });

  test('should warn when trying to get a ref without a key', () => {
    const [getRef] = useInputElementRefs<HTMLInputElement>();
    console.warn = vi.fn();
    getRef('');
    expect(console.warn).toHaveBeenCalledWith(`useInputElementRefs: Cannot get ref without key`);
  });
});
