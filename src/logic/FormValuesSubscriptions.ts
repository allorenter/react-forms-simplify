import { SetStateAction } from 'react';

// Gestiona las subscripciones a un determinado valor
class FormValueSubscription {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<any>>();
  }

  getSubscribers() {
    return this.subscribers;
  }

  subscribe(actionFn: SetStateAction<any>) {
    this.subscribers.add(actionFn);
    return () => {
      this.subscribers.delete(actionFn);
    };
  }

  publish(value: any) {
    for (const actionFn of Array.from(this.subscribers)) {
      actionFn(value);
    }
  }
}

// Gestiona subscripcines a todos los valores del formulario
class FormValuesSubscriptions {
  private formValuesSubscriptions: { [key: string]: FormValueSubscription };

  constructor() {
    this.formValuesSubscriptions = {};
  }

  formValueIsInitialized(name: string) {
    return this.formValuesSubscriptions[name] instanceof FormValueSubscription;
  }

  // Añade instancia para gestionar las subscripciones a un valor
  initFormValueSubscription(name: string) {
    if (this.formValueIsInitialized(name)) return null;

    this.formValuesSubscriptions[name] = new FormValueSubscription();
    return true;
  }

  getAllSubscriptions() {
    return this.formValuesSubscriptions;
  }

  getFormValueSubscription(name: string) {
    return this.formValuesSubscriptions[name];
  }

  subscribe(name: string, actionFn: SetStateAction<any>) {
    if (!this.formValueIsInitialized(name)) return null;

    return this.formValuesSubscriptions[name].subscribe(actionFn);
  }

  subscribeAll(actionFn: SetStateAction<any>) {
    const initializedSubscriptionsEntries = Object.entries(this.formValuesSubscriptions);

    if (initializedSubscriptionsEntries.length === 0) return null;

    initializedSubscriptionsEntries.forEach((entry) => {
      const [name, formValueSubscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      formValueSubscription.subscribe(customAction);
    });
    return true;
  }

  publish(name: string, value: any) {
    if (!this.formValueIsInitialized(name)) return null;

    this.formValuesSubscriptions[name].publish(value);
    return true;
  }
}

export default FormValuesSubscriptions;
