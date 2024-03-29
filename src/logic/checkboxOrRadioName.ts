function createCheckboxOrRadioName(name: string, value: string) {
  return `${name}{{${value}}}`;
}

function splitCheckboxOrRadioName(checkboxName: string) {
  const splitResult = checkboxName.split('{{');
  const n = splitResult[0] || '';
  const v = splitResult[1] || '';
  const formattedV = v.replaceAll('}}', '');
  return [n, formattedV];
}

export { createCheckboxOrRadioName, splitCheckboxOrRadioName };
