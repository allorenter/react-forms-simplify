import { SetStateAction } from 'react';

// Gestiona las subscripciones a un determinado valor
class FormValueSubscription {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<any>>();
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

  // Añade instancia para gestionar las subscripciones a un valor
  addSubscription(name: string) {
    if (!this.formValuesSubscriptions[name]) {
      this.formValuesSubscriptions[name] = new FormValueSubscription();
    }
  }

  subscribe(name: string, actionFn: SetStateAction<any>) {
    if (this.formValuesSubscriptions[name]) {
      this.formValuesSubscriptions[name].subscribe(actionFn);
    }
  }

  subscribeAll(actionFn: SetStateAction<any>) {
    Object.entries(this.formValuesSubscriptions).forEach((entry) => {
      const [name, formValueSubscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      formValueSubscription.subscribe(customAction);
    });
  }

  publish(name: string, value: any) {
    this.addSubscription(name);
    this.formValuesSubscriptions[name].publish(value);
  }
}

export default FormValuesSubscriptions;
