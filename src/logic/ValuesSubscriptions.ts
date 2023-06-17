import { SetStateAction } from 'react';

// Gestiona las subscripciones a un determinado valor
class ValueSubscription {
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
class ValuesSubscriptions {
  private valuesSubscriptions: { [key: string]: ValueSubscription };

  constructor() {
    this.valuesSubscriptions = {};
  }

  valueIsInitialized(name: string) {
    return this.valuesSubscriptions[name] instanceof ValueSubscription;
  }

  // Añade instancia para gestionar las subscripciones a un valor
  initValueSubscription(name: string) {
    if (this.valueIsInitialized(name)) return null;

    this.valuesSubscriptions[name] = new ValueSubscription();
    return true;
  }

  getAllSubscriptions() {
    return this.valuesSubscriptions;
  }

  getValueSubscription(name: string) {
    return this.valuesSubscriptions[name];
  }

  subscribe(name: string, actionFn: SetStateAction<any>) {
    if (!this.valueIsInitialized(name)) return null;

    return this.valuesSubscriptions[name].subscribe(actionFn);
  }

  subscribeAll(actionFn: SetStateAction<any>) {
    const initializedSubscriptionsEntries = Object.entries(this.valuesSubscriptions);

    if (initializedSubscriptionsEntries.length === 0) return null;

    initializedSubscriptionsEntries.forEach((entry) => {
      const [name, valueSubscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      valueSubscription.subscribe(customAction);
    });
    return true;
  }

  publish(name: string, value: any) {
    if (!this.valueIsInitialized(name)) return null;

    this.valuesSubscriptions[name].publish(value);
    return true;
  }
}

export default ValuesSubscriptions;
