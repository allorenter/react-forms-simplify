import { describe, test, expect } from 'vitest';
import formatFormValues from './formatFormValues';

describe('formatFormValues tests', () => {
  test('formatValues() works with a single key-value pair', () => {
    const fields = { test: 'hello' };
    expect(formatFormValues(fields)).toEqual({ test: 'hello' });
  });

  test('formatValues() works with nested keys', () => {
    const fields = { 'test.nested': 'hello' };
    expect(formatFormValues(fields)).toEqual({ test: { nested: 'hello' } });
  });

  test('formatValues() works with multiple nested keys', () => {
    const fields = { 'test.nested.nestedAgain': 'hello' };
    expect(formatFormValues(fields)).toEqual({ test: { nested: { nestedAgain: 'hello' } } });
  });

  test('formatValues() works with multiple keys', () => {
    const fields = { 'test1.nested1': 'hello', 'test2.nested2': 'world' };
    expect(formatFormValues(fields)).toEqual({
      test1: { nested1: 'hello' },
      test2: { nested2: 'world' },
    });
  });

  test('formatValues() works with no nested keys', () => {
    const fields = { test1: 'hello', test2: 'world' };
    expect(formatFormValues(fields)).toEqual({ test1: 'hello', test2: 'world' });
  });
});
