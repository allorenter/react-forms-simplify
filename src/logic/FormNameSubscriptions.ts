import Subscriptions, { ActionFn } from './Subscriptions';

class FormNameSubscriptions {
  private formNamesSubscriptions: { [key: string]: Subscriptions };

  constructor() {
    this.formNamesSubscriptions = {};
  }

  isInitialized(name: string) {
    return this.formNamesSubscriptions[name] instanceof Subscriptions;
  }

  initSubscription(name: string) {
    if (this.isInitialized(name)) return null;

    this.formNamesSubscriptions[name] = new Subscriptions();
    return true;
  }

  getAllSubscriptions() {
    return this.formNamesSubscriptions;
  }

  getSubscription(name: string) {
    return this.formNamesSubscriptions[name];
  }

  subscribe(name: string, actionFn: ActionFn) {
    if (!this.isInitialized(name)) return null;

    return this.formNamesSubscriptions[name].subscribe(actionFn);
  }

  subscribeAll(actionFn: ActionFn) {
    const initializedSubscriptionsEntries = Object.entries(this.formNamesSubscriptions);

    if (initializedSubscriptionsEntries.length === 0) return null;

    initializedSubscriptionsEntries.forEach((entry) => {
      const [name, subscription] = entry;
      const customAction = (value: any) => {
        actionFn(name, value);
      };
      subscription.subscribe(customAction);
    });
    return true;
  }

  publish(name: string, value: any) {
    if (!this.isInitialized(name)) return null;

    this.formNamesSubscriptions[name].publish(value);
    return true;
  }
}

export default FormNameSubscriptions;
