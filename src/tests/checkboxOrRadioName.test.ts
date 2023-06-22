import { describe, test, expect } from 'vitest';
import { splitCheckboxOrRadioName, createCheckboxOrRadioName } from '@/logic/checkboxOrRadioName';

describe('checkbox name tests', () => {
  test('should return the correct checkbox name format', () => {
    const chkName = 'test';
    const chkValue = 'valueA';
    const expected = 'test{{valueA}}';

    expect(createCheckboxOrRadioName(chkName, chkValue)).toEqual(expected);
  });

  test('should return the correct name form checkboxName', () => {
    const checkboxName = 'test{{valueA}}';
    const expected = ['test', 'valueA'];

    expect(splitCheckboxOrRadioName(checkboxName)).toEqual(expected);
  });
});
