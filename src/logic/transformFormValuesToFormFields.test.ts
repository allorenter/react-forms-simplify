import { describe, test, expect } from 'vitest';
import transformFormValuesToFormFields from './transformFormValuesToFormFields';

describe('transformFormValuesToFormFields', () => {
  test('should returns an empty object for an empty input object', () => {
    expect(transformFormValuesToFormFields({})).toEqual({});
  });

  test('should returns a single key-value pair for a single-level input object', () => {
    expect(transformFormValuesToFormFields({ key: 'value' })).toEqual({ key: 'value' });
  });

  test('should returns multiple key-value pairs with dot-separated keys for a multi-level input object', () => {
    const input = {
      key1: 'value1',
      key2: {
        nestedKey1: 'nestedValue1',
        nestedKey2: {
          nestedNestedKey1: 'nestedNestedValue1',
        },
      },
    };

    const expected = {
      key1: 'value1',
      'key2.nestedKey1': 'nestedValue1',
      'key2.nestedKey2.nestedNestedKey1': 'nestedNestedValue1',
    };

    expect(transformFormValuesToFormFields(input)).toEqual(expected);
  });

  test('should return array values correctly', () => {
    const input = {
      key1: 'value1',
      key2: {
        nestedKey1: 'nestedValue1',
        nestedKey2: ['a', 'b'],
      },
    };

    const expected = {
      key1: 'value1',
      'key2.nestedKey1': 'nestedValue1',
      'key2.nestedKey2': ['a', 'b'],
    };

    expect(transformFormValuesToFormFields(input)).toEqual(expected);
  });
});
