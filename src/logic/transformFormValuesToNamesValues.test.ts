import { describe, test, expect } from 'vitest';
import transformFormValuesToNamesValues from './transformFormValuesToNamesValues';

describe('transformFormValuesToNamesValues', () => {
  test('should returns an empty object for an empty input object', () => {
    expect(transformFormValuesToNamesValues({})).toEqual({});
  });

  test('should returns a single key-value pair for a single-level input object', () => {
    expect(transformFormValuesToNamesValues({ key: 'value' })).toEqual({ key: 'value' });
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

    expect(transformFormValuesToNamesValues(input)).toEqual(expected);
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

    expect(transformFormValuesToNamesValues(input)).toEqual(expected);
  });
});
