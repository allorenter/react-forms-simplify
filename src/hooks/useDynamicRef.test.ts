import { describe, test, expect, vi } from 'vitest';
import useDynamicRefs from './useDynamicRef';

describe('useDynamicRefs', () => {
  test('should set and get a ref object', () => {
    const [getRef, setRef] = useDynamicRefs<HTMLInputElement>();
    const inputRef = setRef('input');
    expect(inputRef).toBeDefined();
    expect(getRef('input')).toEqual(inputRef);
  });

  test('should warn when trying to set a ref without a key', () => {
    const [, setRef] = useDynamicRefs<HTMLInputElement>();
    console.warn = vi.fn();
    setRef('');
    expect(console.warn).toHaveBeenCalledWith(`useDynamicRefs: Cannot set ref without key `);
  });

  test('should warn when trying to get a ref without a key', () => {
    const [getRef] = useDynamicRefs<HTMLInputElement>();
    console.warn = vi.fn();
    getRef('');
    expect(console.warn).toHaveBeenCalledWith(`useDynamicRefs: Cannot get ref without key`);
  });
});
