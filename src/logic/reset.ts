import { DefaultValues, TouchedValues, TypeValues, Values } from '..';
import TouchedSubscriptions from './TouchedSubscriptions';
import ValuesSubscriptions from './ValuesSubscriptions';
import { splitCheckboxOrRadioName } from './checkboxOrRadioName';
import _touchValue from './touchValue';
import transformFormValuesToValues from './transformFormValuesToValues';

type ResetArgs<TFormValues extends Values = Values> = {
  val: DefaultValues<TFormValues>;
  touchedValues: TouchedValues;
  values: Values;
  valuesSubscriptions: ValuesSubscriptions;
  valuesTypes: TypeValues;
  touchedSubscriptions: TouchedSubscriptions;
};

function _reset<TFormValues extends Values = Values>(args: ResetArgs<TFormValues>) {
  const { val, values, touchedSubscriptions, touchedValues, valuesSubscriptions, valuesTypes } =
    args;
  const newValues = transformFormValuesToValues(val);

  // indica si queremos resetear todos los valores, recibimos undefined | null | {}
  const resetAllValues =
    val === undefined || val === null || (typeof val === 'object' && Object.keys(val).length === 0);

  Object.entries(resetAllValues ? { ...values } : newValues).forEach((entry) => {
    const [name, value] = entry;

    if (valuesTypes[name] === 'checkbox') {
      // recorro los checkboxValues suscritos y los pongo a false en caso de no estar en value
      const subscriptions = valuesSubscriptions.getAllSubscriptions();
      Object.entries(subscriptions)
        .filter((subscriptionProperty) => {
          const [checkboxName] = subscriptionProperty;
          if (!checkboxName.includes('{{') && !checkboxName.includes('}}')) {
            return false;
          }
          const [n] = splitCheckboxOrRadioName(checkboxName);
          return n === name;
        })
        .forEach((subscriptionProp) => {
          const [checkboxName, subscription] = subscriptionProp;
          const [, v] = splitCheckboxOrRadioName(checkboxName);
          subscription.publish(
            value && !resetAllValues ? value.findIndex((arrV: string) => arrV !== v) === -1 : false,
          );
        });
    }

    if (valuesTypes[name] === 'radio') {
      const subscriptions = valuesSubscriptions.getAllSubscriptions();
      Object.entries(subscriptions)
        .filter((subscriptionProperty) => {
          const [radioName] = subscriptionProperty;
          if (!radioName.includes('{{') && !radioName.includes('}}')) {
            return false;
          }
          const [n] = splitCheckboxOrRadioName(radioName);
          return n === name;
        })
        .forEach((subscriptionProp) => {
          const [radioName, subscription] = subscriptionProp;
          const [, v] = splitCheckboxOrRadioName(radioName);
          subscription.publish(resetAllValues ? false : v === value);
        });
    }

    valuesSubscriptions.publish(name, resetAllValues ? '' : value);
    _touchValue({
      name,
      touch: false,
      touchedSubscriptions,
      touchedValues,
    });
  });

  values.current = resetAllValues ? {} : newValues;
}

export default _reset;
