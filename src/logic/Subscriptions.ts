export type ActionFn = (p: any, p1?: any) => void;

class Subscriptions {
  private subscribers: Set<ActionFn>;

  constructor() {
    this.subscribers = new Set<ActionFn>();
  }

  getSubscribers() {
    return this.subscribers;
  }

  subscribe(actionFn: ActionFn) {
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

export default Subscriptions;
