import { describe, test, expect } from 'vitest';
import bindOptionsToValidation from '@/logic/bindOptionsToValidation';

describe('bindOptionsToValidation tests', () => {
  test('should transform from options value of a bind element to a validation object', () => {
    const bindOptions = {
      onChange: () => {},
      required: true,
    };

    expect(bindOptionsToValidation(bindOptions)).toEqual({ required: true });
  });

  test('should return null if the bindOptions object does not have any valid validation property', () => {
    const bindOptions = {
      onChange: () => {},
    };

    expect(bindOptionsToValidation(bindOptions)).toEqual(null);
  });
});
