import { SetStateAction } from 'react';

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

class FormValuesSubscriptions {
  private formControlSubscriptions: { [key: string]: FormValueSubscription };

  constructor() {
    this.formControlSubscriptions = {};
  }

  addSubscription(name: string) {
    if (!this.formControlSubscriptions[name]) {
      this.formControlSubscriptions[name] = new FormValueSubscription();
    }
  }

  addSubscriber(name: string, actionFn: SetStateAction<any>) {
    if (this.formControlSubscriptions[name]) {
      this.formControlSubscriptions[name].subscribe(actionFn);
    }
  }

  addGlobalSubscriber(actionFn: SetStateAction<any>) {
    Object.entries(this.formControlSubscriptions).forEach((entry) => {
      const [name, formValueSubscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      formValueSubscription.subscribe(customAction);
    });
  }

  publish(name: string, value: any) {
    this.addSubscription(name);
    this.formControlSubscriptions[name].publish(value);
  }
}

export default FormValuesSubscriptions;
