import { TouchedValues } from '@/types/Form';
import { SetStateAction } from 'react';

class TouchedSubscriptions {
  private subscribers: Set<SetStateAction<any>>;

  constructor() {
    this.subscribers = new Set<SetStateAction<TouchedValues>>();
  }

  subscribe(actionFn: SetStateAction<any>) {
    this.subscribers.add(actionFn);
    return () => {
      this.subscribers.delete(actionFn);
    };
  }

  publish(touchedValues: TouchedValues) {
    for (const actionFn of Array.from(this.subscribers)) {
      actionFn(touchedValues);
    }
  }

  getSubscribers() {
    return this.subscribers;
  }
}

export default TouchedSubscriptions;
