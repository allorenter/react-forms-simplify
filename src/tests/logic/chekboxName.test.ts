import { describe, test, expect } from 'vitest';
import { splitCheckboxName, createCheckboxName } from '../../logic/checkboxName';

describe('checkbox name tests', () => {
  test('should return the correct checkbox name format', () => {
    const chkName = 'test';
    const chkValue = 'valueA';
    const expected = 'test{{valueA}}';

    expect(createCheckboxName(chkName, chkValue)).toEqual(expected);
  });

  test('should return the correct name form checkboxName', () => {
    const checkboxName = 'test{{valueA}}';
    const expected = ['test', 'valueA'];

    expect(splitCheckboxName(checkboxName)).toEqual(expected);
  });
});
