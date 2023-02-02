import { SetStateAction } from 'react';

// Gestiona las subscripciones a un determinado valor
class FormFieldSubscription {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<any>>();
  }

  getSubscribers() {
    return this.subscribers;
  }

  subscribe(actionFn: SetStateAction<any>) {
    // en caso de ser updateRefValue, elimino la anterior si la hubiera
    if (actionFn.name === 'updateRefValue') {
      const lastFn = [...this.subscribers].find((fn) => fn.name === 'updateRefValue');
      if (lastFn) this.subscribers.delete(lastFn);
    }
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
class NamesValuesSubscriptions {
  private namesValuesSubscriptions: { [key: string]: FormFieldSubscription };

  constructor() {
    this.namesValuesSubscriptions = {};
  }

  formFieldIsInitialized(name: string) {
    return this.namesValuesSubscriptions[name] instanceof FormFieldSubscription;
  }

  // Añade instancia para gestionar las subscripciones a un valor
  initFormFieldSubscription(name: string) {
    if (this.formFieldIsInitialized(name)) return null;

    this.namesValuesSubscriptions[name] = new FormFieldSubscription();
    return true;
  }

  getAllSubscriptions() {
    return this.namesValuesSubscriptions;
  }

  getFormFieldSubscription(name: string) {
    return this.namesValuesSubscriptions[name];
  }

  subscribe(name: string, actionFn: SetStateAction<any>) {
    if (!this.formFieldIsInitialized(name)) return null;

    return this.namesValuesSubscriptions[name].subscribe(actionFn);
  }

  subscribeAll(actionFn: SetStateAction<any>) {
    const initializedSubscriptionsEntries = Object.entries(this.namesValuesSubscriptions);

    if (initializedSubscriptionsEntries.length === 0) return null;

    initializedSubscriptionsEntries.forEach((entry) => {
      const [name, formFieldSubscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      formFieldSubscription.subscribe(customAction);
    });
    return true;
  }

  publish(name: string, value: any) {
    if (!this.formFieldIsInitialized(name)) return null;

    this.namesValuesSubscriptions[name].publish(value);
    return true;
  }
}

export default NamesValuesSubscriptions;
