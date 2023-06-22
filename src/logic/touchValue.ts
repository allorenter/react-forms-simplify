import { FormName, TouchedValues, Values } from '@/index';
import Subscriptions from './Subscriptions';

type TouchValueArgs<TFormValues> = {
  name: FormName<TFormValues>;
  touch: boolean;
  touchedValues: TouchedValues;
  touchedSubscriptions: Subscriptions;
};

function _touchValue<TFormValues extends Values = Values>(args: TouchValueArgs<TFormValues>) {
  const { touchedValues, touch, touchedSubscriptions, name } = args;
  // solo lo ejecuto en caso de querer cambiar su valor
  if (touchedValues[name] !== touch) {
    touchedValues[name] = touch;
    touchedSubscriptions.publish(touchedValues);
  }
}

export default _touchValue;
