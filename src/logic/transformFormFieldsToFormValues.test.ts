import { describe, test, expect } from 'vitest';
import transformFormFieldsToFormValues from './transformFormFieldsToFormValues';

describe('transformFormFieldsToFormValues tests', () => {
  test('should works with a single key-value pair', () => {
    const fields = { test: 'hello' };
    expect(transformFormFieldsToFormValues(fields)).toEqual({ test: 'hello' });
  });

  test('should works with nested keys', () => {
    const fields = { 'test.nested': 'hello' };
    expect(transformFormFieldsToFormValues(fields)).toEqual({ test: { nested: 'hello' } });
  });

  test('should works with multiple nested keys', () => {
    const fields = { 'test.nested.nestedAgain': 'hello' };
    expect(transformFormFieldsToFormValues(fields)).toEqual({
      test: { nested: { nestedAgain: 'hello' } },
    });
  });

  test('should works with multiple keys', () => {
    const fields = { 'test1.nested1': 'hello', 'test2.nested2': 'world' };
    expect(transformFormFieldsToFormValues(fields)).toEqual({
      test1: { nested1: 'hello' },
      test2: { nested2: 'world' },
    });
  });

  test('should works with no nested keys', () => {
    const fields = { test1: 'hello', test2: 'world' };
    expect(transformFormFieldsToFormValues(fields)).toEqual({ test1: 'hello', test2: 'world' });
  });
});
