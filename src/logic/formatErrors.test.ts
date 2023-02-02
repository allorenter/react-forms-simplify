import { describe, test, expect } from 'vitest';
import { FormErrors } from '..';
import formatErrors from './formatErrors';

describe('formatErrors', () => {
  test('should remove entries with undefined values', () => {
    const errors = {
      field1: { name: 'field1', type: 'required', message: 'This field is required' },
      field2: undefined,
      field3: { name: 'field3', type: 'validateFunction', message: 'Invalid value' },
    };
    const expectedResult = {
      field1: { name: 'field1', type: 'required', message: 'This field is required' },
      field3: { name: 'field3', type: 'validateFunction', message: 'Invalid value' },
    };

    expect(formatErrors(errors as FormErrors)).toEqual(expectedResult);
  });

  test('should return an empty object for an empty input object', () => {
    const errors = {};
    const expectedResult = {};

    expect(formatErrors(errors)).toEqual(expectedResult);
  });

  test('should return an empty object for an input object that has only undefined values', () => {
    const errors = {
      field1: undefined,
      field2: undefined,
      field3: undefined,
    };
    const expectedResult = {};

    expect(formatErrors(errors)).toEqual(expectedResult);
  });

  test('should return the input object for an input object that has only non-undefined values', () => {
    const errors = {
      field1: { name: 'field1', type: 'required', message: 'This field is required' },
      field2: { name: 'field2', type: 'validateFunction', message: 'Invalid value' },
      field3: { name: 'field3', type: 'required', message: 'This field is also required' },
    };
    const expectedResult = {
      field1: { name: 'field1', type: 'required', message: 'This field is required' },
      field2: { name: 'field2', type: 'validateFunction', message: 'Invalid value' },
      field3: { name: 'field3', type: 'required', message: 'This field is also required' },
    };

    expect(formatErrors(errors as FormErrors)).toEqual(expectedResult);
  });
});
