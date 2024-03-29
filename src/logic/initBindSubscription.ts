import { BindUnsubscribeFns, FormName, UpdateInputInvalid, UpdateInputValue } from '..';
import FormNameSubscriptions from './FormNameSubscriptions';

type InitBindSubscriptionArgs<TFormValues> = {
  name: FormName<TFormValues>;
  valuesSubscriptions: FormNameSubscriptions;
  updateInputValue: UpdateInputValue;
  bindUnsubscribeFns: BindUnsubscribeFns;
  errorsSubscriptions: FormNameSubscriptions;
  updateInputInvalid: UpdateInputInvalid;
};

// SOLO SIRVE PARA LOS INTERNAl BINDS: bind, bindCheckbox, bindNumber, bindRadio
function initBindSubscription<TFormValues>(args: InitBindSubscriptionArgs<TFormValues>) {
  const {
    bindUnsubscribeFns,
    name,
    valuesSubscriptions,
    updateInputValue,
    errorsSubscriptions,
    updateInputInvalid,
  } = args;

  const bindSubscriptions = bindUnsubscribeFns[name as string];

  if (Array.isArray(bindSubscriptions)) {
    bindSubscriptions.forEach((fn) => {
      if (typeof fn === 'function') fn();
    });
  }

  if (typeof bindSubscriptions === 'function') {
    bindSubscriptions();
  }

  bindUnsubscribeFns[name as string] = [
    valuesSubscriptions.subscribe(name as string, updateInputValue) as () => void,
    errorsSubscriptions.subscribe(name as string, updateInputInvalid) as () => void,
  ];
}

export default initBindSubscription;
